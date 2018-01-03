#!/usr/bin/env groovy
def name = "visualizer-radar";
# below should be used to get the accounts, but there seems to be a global "accounts" somewhere that prevents this.
# accounts should come from the infrastructure cloud formation scripting.
# args ???
# args.slackChannel is opaque.
# what is "Test Docker Image"?
def account_name = name.toUpperCase().replace("-","");

movePipelineECS(ecsCluster: "mars-ecs-cluster",
                appName: name,
                mainContainerName: name,
                mainContainerPort: "3000",
                deployConfigDir: "deployment/config",
                slackChannel: name+"-dev",
                buildDockerImage: "prosoft/"+name,
                testDockerImage: { Map args, buildinfo ->
                  moveDocker.run("Test Docker Image", "", buildinfo, "test", args.slackChannel)
                },
                prEnvFileName: name+"visualizer-radar-qa-pr",
                stagingEnvFileName: name+"-qa-staging",
                devAccount: accounts.get().TPHUB_DEV_US_WEST_2_PRIVATE,
                qaAccount: accounts.get().TPHUB_QA_US_WEST_2_PRIVATE,
                prodAccount: accounts.get().TPHUB_PROD_US_WEST_2_PRIVATE)