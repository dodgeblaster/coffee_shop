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
                    name: 'DeployFront',
                    script: '/deployFront.yml',
                    env: {
                        STAGE: 'staging',
                        TOKEN: '@secret.VERCEL_TOKEN'
                    },
                    inputArtifact: 'sourceZip',
                    outputArtifact: 'frontZip'
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
