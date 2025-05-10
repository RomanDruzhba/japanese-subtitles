const testsDir = 'dist_tests';

module.exports = (config) => {
    config.set({
        basePath: '',

        frameworks: [
            'mocha',
            'source-map-support',
        ],

        plugins: [
            'karma-mocha',
            'karma-source-map-support',
            'karma-firefox-launcher',
        ],

        files: [
            {
                pattern: `${testsDir}/*.js`,
            },
        ],

        port: 9876,

        colors: true,

        autoWatch: false,

        browsers: ['FirefoxHeadless'],
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless'],
            },
        },

        browserNoActivityTimeout: 90000,

        singleRun: true,

        concurrency: Infinity,

        browserDisconnectTolerance: 10,

        client: {
            mocha: {
                timeout: 50000,
            },
        },
    });
};
