import { CloudFormation, EC2} from "aws-sdk";

export interface ServerlessInstance {
  service: {
    service: string;
    provider: {
      stage: string;
      stackName: string;
      compiledCloudFormationTemplate: {
        Resources: any;
      };
    };
    custom: {
      vpcPeerOptions: {
        peer: string;
        accepterAllowDnsResolutionFromRemoteVpc: boolean;
        accepterAllowEgressFromLocalClassicLinkToRemoteVpc: boolean;
        accepterAllowEgressFromLocalVpcToRemoteClassicLink: boolean;
        requesterAllowDnsResolutionFromRemoteVpc: boolean;        
        requesterAllowEgressFromLocalClassicLinkToRemoteVpc: boolean;
        requesterAllowEgressFromLocalVpcToRemoteClassicLink: boolean;
        enabled: boolean;
      };
    };
  };
  providers: {
    aws: {
      sdk: {
        CloudFormation: any;
        EC2: any;
      };
      getCredentials();
      getRegion();
    };
  };
  cli: {
    log(str: string);
    consoleLog(str: any);
  };
}