import TxDataSend from './send.js';
import TxDataMultisend from './multisend.js';
import TxDataSell from './sell.js';
import TxDataBuy from './buy.js';
import TxDataSellAll from './sell-all.js';
import TxDataCreateCoin from './create-coin.js';
import TxDataDeclareCandidacy from './declare-candidacy.js';
import TxDataEditCandidate from './edit-candidate.js';
import TxDataSetCandidateOn from './set-candidate-on.js';
import TxDataSetCandidateOff from './set-candidate-off.js';
import TxDataDelegate from './delegate.js';
import TxDataUnbond from './unbond.js';
import TxDataRedeemCheck from './redeem-check.js';
import TxDataCreateMultisig from './create-multisig.js';

import {TX_TYPE, normalizeTxType} from '../tx-types.js';

const TX_DATA_CONSTRUCTOR = {
    [TX_TYPE.SEND]: TxDataSend,
    [TX_TYPE.MULTISEND]: TxDataMultisend,
    [TX_TYPE.SELL]: TxDataSell,
    [TX_TYPE.BUY]: TxDataBuy,
    [TX_TYPE.SELL_ALL]: TxDataSellAll,
    [TX_TYPE.CREATE_COIN]: TxDataCreateCoin,
    [TX_TYPE.DECLARE_CANDIDACY]: TxDataDeclareCandidacy,
    [TX_TYPE.EDIT_CANDIDATE]: TxDataEditCandidate,
    [TX_TYPE.SET_CANDIDATE_ON]: TxDataSetCandidateOn,
    [TX_TYPE.SET_CANDIDATE_OFF]: TxDataSetCandidateOff,
    [TX_TYPE.DELEGATE]: TxDataDelegate,
    [TX_TYPE.UNBOND]: TxDataUnbond,
    [TX_TYPE.REDEEM_CHECK]: TxDataRedeemCheck,
    [TX_TYPE.CREATE_MULTISIG]: TxDataCreateMultisig,
};

/**
 *
 * @param data
 * @param {TX_TYPE|number|string|Buffer|Uint8Array} txType
 * @constructor
 * @return {TxDataSend|TxDataMultisend|TxDataSell|TxDataSellAll|TxDataBuy|TxDataCreateCoin|TxDataDeclareCandidacy|TxDataEditCandidate|TxDataSetCandidateOn|TxDataSetCandidateOff|TxDataDelegate|TxDataUnbond|TxDataRedeemCheck|TxDataCreateMultisig}
 */
export default function TxData(data, txType) {
    txType = normalizeTxType(txType);
    const TxDataConstructor = TX_DATA_CONSTRUCTOR[txType];

    return new TxDataConstructor(data);
}
