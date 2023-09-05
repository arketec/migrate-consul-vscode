export default function () {
    return `{
    <% if (props.useMongo)  { %> // configure mongodb
    "database": {
        "host": "<%= props.mongoHost %>",
        "port": "<%= props.mongoPort %>",
        "dbname": "<%= props.dbName %>"
        // use instead of host:port:dbname
        //"connectionString": "<%= props.mongoConnectionString %>", 
        //"connectionStringEnvVar": "<%= props.mongoConnectionStringEnvVar %>"
    },
    <% } %>
    // configure consul agent
    "consul": {
        "host": "<%= props.consulHost %>",
        "port": "<%= props.consulPort %>",
        "secure": <%= props.consulSecure %>,
        "acl": <%= props.useAcl %>,
        "aclTokenEnvVar": "<%= props.aclTokenEnvVar %>"
    },
    // configure script generation options
    "generation": {
        "printExamples": <%= props.printSamples %>,
        "generateTypesFromKeys": <%= props.generateTypesFromKeys %>,
        "includeTypes": <%= props.includeTypes %>
    },
    // configure verify --diff options
    "diff": {
        "maxDiffLength": <%= props.maxDiffLength %>,
        "colors": {
            "bg": "<%= props.colors.bg %>",
            "added": "<%= props.colors.added %>",
            "removed": "<%= props.colors.removed %>",
            "unchanged": "<%= props.colors.unchanged %>",
        }
    },
    // environment config
    "migrationsDirectory": "<%= props.migrationsDirectory %>",
    "environment": "<%= props.environment %>",
    "debug": false
}`;
}