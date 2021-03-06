import defineProperties from '../define-properties.js';
import TxDataSend from './send.js';

class TxDataMultisend {
    constructor(data) {
        data = data || {};
        // Define Properties
        const fields = [
            {
                name: 'list',
                default: Buffer.from([]),
                allowNonBinaryArray: true,
                nonBinaryArrayTransform(item) {
                    return (new TxDataSend(item)).raw;
                },
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

export default TxDataMultisend;
