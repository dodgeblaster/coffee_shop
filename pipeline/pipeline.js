module.exports = {
    name: 'coffeeshop-pipeline',
    stages: [
        {
            name: 'Source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'source',
                    repo: 'coffee_shop',
                    owner: 'dodgeblaster',
                    outputArtifact: 'sourceZip'
                }
            ]
        },
        {
            name: 'Staging',
            actions: [
                {
                    type: 'BUILD',
                    name: 'DeployApi',
                    script: '/deployApi.yml',
                    env: {
                        STAGE: 'staging'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'buildZip'
                },
                {
                    type: 'BUILD',
                    name: 'Test',
                    script: '/test.yml',
                    env: {
                        STAGE: 'staging'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'testZip'
                }
            ]
        }
    ]
}
