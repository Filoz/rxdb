import {
    default as inMemoryFilter
} from 'pouchdb-find/lib/adapters/local/find/in-memory-filter.js';
import {
    massageSelector
} from 'pouchdb-find/lib/adapters/local/utils.js';

/**
 * if a query is observed and a changeEvent comes in,
 * the QueryChangeDetector tries to execute the changeEvent-delta on the exisiting query-results
 * or tells the query it should re-exec on the database if previous not possible.
 */
class QueryChangeDetector {

    constructor(query) {
        this.query = query;
    }

    /**
     * @param {Object[]} resultsData of previous results
     * @param {ChangeEvent[]} changeEvents
     * @return {{mustReExec: boolean, results: []}} if reexec==true, the query must rerun over the database
     */
    runChangeDetection(resultsData, changeEvents) {
        if (changeEvents.length == 0) {
            return {
                mustReExec: false,
                results: null
            };
        }
        //        const docId = changeEvent.data.doc;
        //        const previousResults = this.query.results;
        //        const wasDocInResults = previousResults.find();
        // TODO continue here
        return {
            mustReExec: true,
            results: results
        };
    }

    /**
     * check if the document matches the query
     * @param {object} docData
     * @return {boolean}
     */
    doesDocMatchQuery(docData) {
        const inMemoryFields = Object.keys(this.query.toJSON().selector);
        const retDocs = inMemoryFilter(
            [{
                doc: docData
            }], {
                selector: massageSelector(this.query.toJSON().selector)
            },
            inMemoryFields
        );
        return retDocs.length == 1;
    }

    /**
     * check if the document exists in the results data
     * @param {object} docData
     * @param {object[]} resultData
     */
    isDocInResultData(docData, resultData) {
        const primaryPath = this.query.collection.schema.primaryPath;
        const first = resultData.find(doc => doc[primaryPath] == docData[primaryPath]);
        return !!first;
    }

}


/**
 * @param  {RxQuery} query
 * @return {QueryChangeDetector}
 */
export function create(query) {
    const ret = new QueryChangeDetector(query);
    return ret;
}
