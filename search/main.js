const cron = require("node-cron");
const { startServer } = require("./server");
const { getDatabase } = require("./database");
const {
    createDatabaseSearch,
    searchResultFilter,
    createDatabaseList
} = require("./search");

const main = async () => {
    let database = await getDatabase();
    let databaseSearch = createDatabaseSearch(database);
    let databaseList = createDatabaseList(database);
    cron.schedule("0 */2 * * *", async () => {
        database = await getDatabase();
        databaseSearch = createDatabaseSearch(database);
        databaseList = createDatabaseList(database);
    });

    startServer(
        (collection, query, count, offset, orderKey, order) => {
            let result = databaseSearch(collection, query);
            const totalRecords = result.length;
            result = searchResultFilter(result, count, offset, orderKey, order);
            return {
                data: result,
                totalRecords
            };
        },
        (collection, count, offset, orderKey, order) => {
            let result = databaseList(collection);
            const totalRecords = result.length;
            result = searchResultFilter(result, count, offset, orderKey, order);
            return {
                data: result,
                totalRecords
            };
        },
        (collection, count) => {
            count = parseInt(count);
            let result = [...databaseList(collection)];
            result = [...Array(count)]
                .map(
                    () =>
                        result.splice(
                            Math.floor(Math.random() * result.length),
                            1
                        )[0]
                )
                .filter(e => typeof e !== "undefined" && e !== null);

            return {
                data: result,
                totalRecords: result.length
            };
        }
    );
};

main();
// startServer();