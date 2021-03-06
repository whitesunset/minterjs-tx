import axios from 'axios';
import {mPrefixToHex, convertToPip} from 'minterjs-util';
import config from './config.js';
import MinterTx from '../src/index.js';
import MinterTxSignature from '../src/tx-signature.js';
import MinterSendTxData from '../src/tx-data/send.js';
import {TX_TYPE} from '../src/tx-types.js';
import {coinToBuffer} from '../src/helpers.js';

const PRIVATE_KEY = new Buffer('5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da', 'hex');
const ADDRESS = 'Mx7633980c000139dd3bd24a3f54e06474fa941e16';
const FORM_DATA = {
    address: 'Mx376615B9A3187747dC7c32e51723515Ee62e37Dc',
    amount: 1,
    coin: 'MNT',
    payload: 'custom text',
};

function getNonce() {
    return axios.get(`${config.nodeUrl}/address?address=${ADDRESS}`)
        .then((response) => Number(response.data.result.transaction_count) + 1);
}

export function postTx() {
    return getNonce()
        .then((nonce) => {
            const txData = new MinterSendTxData({
                to: mPrefixToHex(FORM_DATA.address),
                coin: coinToBuffer(FORM_DATA.coin),
                value: `0x${convertToPip(FORM_DATA.amount, 'hex')}`,
            });
            console.log('raw data', txData.raw);
            const txParams = {
                nonce: `0x${nonce.toString(16)}`,
                chainId: '0x02',
                gasPrice: '0x01',
                gasCoin: coinToBuffer(FORM_DATA.coin),
                type: TX_TYPE.SEND,
                data: txData.serialize(),
                signatureType: '0x01'
            };

            if (FORM_DATA.payload) {
                txParams.payload = `0x${Buffer.from(FORM_DATA.payload, 'utf-8').toString('hex')}`;
            }

            console.log({txParams});

            const tx = new MinterTx(txParams);
            console.log('raw tx', tx.raw);
            tx.signatureData = (new MinterTxSignature()).sign(tx.hash(false), PRIVATE_KEY).serialize();

            console.log('---Serialized TX----');
            console.log(tx.serialize().toString('hex'));
            console.log(`Senders Address: ${tx.getSenderAddress().toString('hex')}`);

            if (tx.verifySignature()) {
                console.log('Signature Checks out!');
            }

            return axios.get(`${config.nodeUrl}/send_transaction?tx=0x${tx.serialize().toString('hex')}`)
                .then((response) => {
                    console.log('Tx send', response.data);
                })
                .catch((error) => {
                    console.log('send error', error.response ? error.response.data : error);
                });
    });
}

// postTx();
