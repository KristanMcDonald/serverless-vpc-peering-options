# serverless-vpc-peering-options
Plugin to set VPC peering options after deployment that are unavailable via Cloudformation

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/KristanMcDonald/serverless-vpc-peering-options/master/LICENSE)

## Why

Cloudformation allows you to create VPC peering connections, which is great - but it then doesn't allow you to set the options assoicated with that peering arrangement. You can only do this from CLI, console or (now) this plugin!

## Usage

### Installation

```bash
npm install serverless-vpc-peering-options --save-dev
```

### Configuration

```yaml
plugins:
  - serverless-vpc-peering-options

custom:
  vpcPeerOptions:
    peer: YourPeeringResource
    accepterAllowDnsResolutionFromRemoteVpc: true
    accepterAllowEgressFromLocalClassicLinkToRemoteVpc: true
    accepterAllowEgressFromLocalVpcToRemoteClassicLink: false
    requesterAllowDnsResolutionFromRemoteVpc: false
    requesterAllowEgressFromLocalClassicLinkToRemoteVpc: false
    requesterAllowEgressFromLocalVpcToRemoteClassicLink: false
    enabled: true
```
The peer and enabled parameters are required - everything else defaults to false, and can be left unset (which is the AWS default).