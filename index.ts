import * as aws from 'aws-sdk';
import { ServerlessInstance } from './ServerlessInstance';
import { ServerlessOptions } from './ServerlessOptions';

interface IHooks {
  'aws:package:finalize:mergeCustomProviderResources': () => void;
}

class ServerlessVPCPeeringOptions {
  private serverless: ServerlessInstance;
  private options: ServerlessOptions;
  private ec2: aws.EC2;
  private cloudFront: string;

  private hooks: IHooks;

  constructor(serverless: ServerlessInstance, options: ServerlessOptions) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'aws:package:finalize:mergeCustomProviderResources': this.setOptions.bind(this)
    };
  }

  private async setOptions() {
    const enabled = this.evaluateEnabled(this.serverless.service.custom.vpcPeerOptions.enabled);
    if (!enabled) {
      this.serverless.cli.log('Skipping serverless-vpc-peering-options as not enabled');
      return;
    }

    const params = {
      VpcPeeringConnectionId: this.serverless.service.custom.vpcPeerOptions.peer,
      AccepterPeeringConnectionOptions: {
        AllowDnsResolutionFromRemoteVpc:
          this.serverless.service.custom.vpcPeerOptions.accepterAllowDnsResolutionFromRemoteVpc || false,
        AllowEgressFromLocalClassicLinkToRemoteVpc:
          this.serverless.service.custom.vpcPeerOptions.accepterAllowEgressFromLocalClassicLinkToRemoteVpc || false,
        AllowEgressFromLocalVpcToRemoteClassicLink:
          this.serverless.service.custom.vpcPeerOptions.accepterAllowEgressFromLocalVpcToRemoteClassicLink || false
      },
      DryRun: true || false,
      RequesterPeeringConnectionOptions: {
        AllowDnsResolutionFromRemoteVpc:
          this.serverless.service.custom.vpcPeerOptions.requesterAllowDnsResolutionFromRemoteVpc || false,
        AllowEgressFromLocalClassicLinkToRemoteVpc:
          this.serverless.service.custom.vpcPeerOptions.requesterAllowEgressFromLocalClassicLinkToRemoteVpc || false,
        AllowEgressFromLocalVpcToRemoteClassicLink:
          this.serverless.service.custom.vpcPeerOptions.requesterAllowEgressFromLocalVpcToRemoteClassicLink || false
      }
    };

    this.ec2.modifyVpcPeeringConnectionOptions(params, function (err, data) {
      if (err) {
        throw new Error(err.message);
      } else {
        this.serverless.cli.log('VPC peering options successfully modified');
      }
    });
  }

  private evaluateEnabled(enabled?: string | boolean) {
    if (enabled === undefined) {
      return true;
    }
    if (typeof enabled === 'boolean') {
      return enabled;
    } else if (typeof enabled === 'string' && enabled === 'true') {
      return true;
    } else if (typeof enabled === 'string' && enabled === 'false') {
      return false;
    }
    throw new Error(`serverless-vpc-peering-options: Ambiguous enablement boolean: '${enabled}'`);
  }
}

export = ServerlessVPCPeeringOptions;
