## zm-certificate-manager-admin-zimlet

## Getting Started
To setup a development environment make sure all the prerequisites are in place and then go ahead with build & deploy.

### Steps to build & deploy.
To create zimlet package:
 ```
ant package-zimlet
 ```

To deploy this zimlet:
 ```
ant deploy-zimlet
 ```

### Prerequisites
- Create .zcs-deps folder in home directory
- Copy ant-contrib-1.0b1.jar to .zcs-deps
- Clone [zimbra-package-stub](https://github.com/Zimbra/zimbra-package-stub) at same level.
- Clone [zm-zcs](https://github.com/Zimbra/zm-zcs) at same level.
- ant is available on command line.