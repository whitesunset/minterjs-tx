import {defineProperties} from 'ethereumjs-util/dist/object.js';

class TxDataSetCandidateOn {
    constructor(data) {
        data = data || {};
        // Define Properties
        const fields = [
            {
                name: 'pubKey',
                allowZero: true,
                default: Buffer.from([]),
            }];

        /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
        // attached serialize
        defineProperties(this, fields, data);
    }
}

export default TxDataSetCandidateOn;
