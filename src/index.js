import ethUtil from 'ethereumjs-util'
import BN from '../node_modules/bn.js/lib/bn'
import {Buffer} from 'safe-buffer'

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

class Transaction {
    constructor (data) {
        data = data || {}
        // Define Properties
        const fields = [{
            name: 'nonce',
            length: 32,
            allowLess: true,
            default: new Buffer([])
        }, {
            name: 'gasPrice',
            length: 32,
            allowLess: true,
            default: new Buffer([])
        }, {
            name: 'type',
            length: 1,
            allowLess: true,
            default: new Buffer([])
        }, {
            name: 'data',
            alias: 'input',
            allowZero: true,
            default: new Buffer([])
        }, {
            name: 'payload',
            allowZero: true,
            default: new Buffer([])
        }, {
            name: 'serviceData',
            allowZero: true,
            default: new Buffer([])
        }, {
            name: 'v',
            allowZero: true,
            default: new Buffer([0x1c])
        }, {
            name: 'r',
            length: 32,
            allowZero: true,
            allowLess: true,
            default: new Buffer([])
        }, {
            name: 's',
            length: 32,
            allowZero: true,
            allowLess: true,
            default: new Buffer([])
        }]

        /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
        // attached serialize
        ethUtil.defineProperties(this, fields, data)

        /**
         * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
         * @name from
         * @memberof Transaction
         */
        Object.defineProperty(this, 'from', {
            enumerable: true,
            configurable: true,
            get: this.getSenderAddress.bind(this)
        })
    }

    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
     * @return {Buffer}
     */
    hash (includeSignature) {
        if (includeSignature === undefined) includeSignature = true

        // EIP155 spec:
        // when computing the hash of a transaction for purposes of signing or recovering,
        // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
        // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0

        let items
        if (includeSignature) {
            items = this.raw
        } else {
            items = this.raw.slice(0, 6)
        }

        // create hash
        return ethUtil.rlphash(items)
    }

    /**
     * returns the sender's address
     * @return {Buffer}
     */
    getSenderAddress () {
        if (this._from) {
            return this._from
        }
        const pubkey = this.getSenderPublicKey()
        this._from = ethUtil.publicToAddress(pubkey)
        return this._from
    }

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey () {
        if (!this._senderPubKey || !this._senderPubKey.length) {
            if (!this.verifySignature()) throw new Error('Invalid Signature')
        }
        return this._senderPubKey
    }

    /**
     * Determines if the signature is valid
     * @return {Boolean}
     */
    verifySignature () {
        const msgHash = this.hash(false)
        // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
        if (new BN(this.s).cmp(N_DIV_2) === 1) {
            return false
        }

        try {
            let v = ethUtil.bufferToInt(this.v)
            this._senderPubKey = ethUtil.ecrecover(msgHash, v, this.r, this.s)
        } catch (e) {
            return false
        }

        return !!this._senderPubKey
    }

    /**
     * sign a transaction with a given a private key
     * @param {Buffer} privateKey
     */
    sign (privateKey) {
        const msgHash = this.hash(false)
        const sig = ethUtil.ecsign(msgHash, privateKey)
        Object.assign(this, sig)
    }

    /**
     * validates the signature and checks to see if it has enough gas
     * @param {Boolean} [stringError=false] whether to return a string with a description of why the validation failed or return a Bloolean
     * @return {Boolean|String}
     */
    validate (stringError) {
        const errors = []
        if (!this.verifySignature()) {
            errors.push('Invalid Signature')
        }

        if (stringError === undefined || stringError === false) {
            return errors.length === 0
        } else {
            return errors.join(' ')
        }
    }
}

export default Transaction
