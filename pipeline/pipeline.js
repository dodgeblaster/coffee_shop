module.exports = {
    name: 'sonic-shopexample-pipeline',
    stages: [
        {
            name: 'source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'source',
                    repo: 'rise-foundation',
                    owner: 'rise-cli',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'DeployTestStage',
            actions: [
                {
                    type: 'BUILD',
                    name: 'DeployApi',
                    script: '/deployApi.yml',
                    env: {
                        STAGE: 'test'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'buildZip'
                }
            ]
        }
        // {
        //     name: 'DeployTests',
        //     actions: [
        //         {
        //             type: 'BUILD',
        //             name: 'DeployApiTests',
        //             script: '/deployApiTests.yml',
        //             env: {
        //                 STAGE: 'test'
        //             },
        //             inputArtifact: 'sourceZip',
        //             outputArtifact: 'buildZip'
        //         }
        //     ]
        // },
        // {
        //     name: 'RunTests',
        //     actions: [
        //         {
        //             type: 'INVOKE',
        //             name: 'DeployTestInfra',
        //             functionName: 'risefoundationtests-createTestInfra-dev',
        //             region: 'us-east-1'
        //         }
        //     ]
        // }
    ]
}
