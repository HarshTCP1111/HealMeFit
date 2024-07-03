```diff


# heal me fit backend
description:


# To install node js in ssh AWS ec2

- 1:    sudo yum install -y gcc-c++ make

- 2.    "curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -"

    notes:

	## Run `sudo yum install -y nodejs` to install Node.js 18.x and npm.
    
    You may run dnf if yum is not available:
     sudo dnf install -y nodejs
    
    You may also need development tools to build native addons:
     sudo yum install gcc-c++ make
     
    To install the Yarn package manager, run:
     curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
     sudo yum install yarn
     
     Error in locale?, to fix:
        $  ls -l /etc/profile.d/lang.sh
        $ source /etc/profile.d/lang.sh

        Verificated:
        $ echo "$LANG"
        $ echo "$LC_CTYPE"

        clean cache install
        sudo rm -R /var/cache/yum/x86_64/2/nodesource/

- 3.    Install GIT
    sudo yum install -y git
    
- 4.    Clone repo de GitHut.        davidgarciabalarezopod
git@github.com:ddelgado-pod/heal-me-fit-backend.git

notes:
Generate key ssh public:

ssh-keygen -t ed25519 -C "david.garcia@hirewithpod.com"
or 
ssh-keygen -t rsa -b 4096 -C  "david.garcia@hirewithpod.com"

Note extra to don't use:
mv /home/ec2-user/my-healmefit-one-backend/be-xxxx /home/ec2-user/my-healmefit-one-backend/be-healmefit


# Install service auto in linux
path: /home/ec2-user/backend/healmefit-backend/be-healmefit

# systemd service

    sudo vim /etc/systemd/system/HealMeFit2.service   
    sudo ls /etc/systemd/system/HealMeFit2.service    
    sudo view /etc/systemd/system/HealMeFit2.service   
    sudo vim /etc/systemd/system/HealMeFit2.service   

  sudo vim /etc/systemd/system/HealMeFit3.service 


sudo cat /etc/systemd/system/HealMeFit2.service > /etc/systemd/system/HealMeFit3.service 


    [Unit]
    Description=YourAppName
    After=multi-user.target

    [Service]
    ExecStart=/usr/bin/node /home/ec2-user/your_app_dir/server.js
    Restart=always
    RestartSec=10
    StandardOutput=syslog
    StandardError=syslog
    SyslogIdentifier=YourAppName
    User=ec2-user
    EnvironmentFile=/home/ec2-user/your_app_dir/app.env

    [Install]
    WantedBy=multi-user.target

# # # # # # # # # # # # # # # # # 
[Unit]
Description=HealMeFit
After=multi-user.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/heal-me-fit-backend/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=HealMeFit
User=ec2-user 
EnvironmentFile= /home/ec2-user/heal-me-fit-backend/.env

[Install]
WantedBy=multi-user.target 


# # # # # # # # # # # # # # # # #
# systemd service



/usr/bin/node /home/ec2-user/backend/healmefit-backend/be-healmefit/server.js



sudo systemctl enable HealMeFit2.service
sudo systemctl disable HealMeFit.service
sudo systemctl start HealMeFit2.service
sudo systemctl restart HealMeFit.service
sudo systemctl status HealMeFit2.service


# to loggin in ssh terminal  in ubuuntuw
systemctl list-unit-files | egrep 'httpd|sshd|Healmefit2'





 ssh -i "new-pair-hmf-pod.pem" ubuntu@ec2-52-53-78-156.us-west-1.compute.amazonaws.com
/Users/davidgarcia/Desktop/pod
52.7.10.17
curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -




 

/Users/davidgarcia/Desktop/pod/

# to logout
    $ exit
    $ logout

# Path server.js in ce2
/home/ec2-user/heal-me-fit-backend



# ports

sudo iptables -t nat -L

sudo iptables -t nat -D PREROUTING 1

sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j     REDIRECT --to-ports 80

sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 8080 -j REDIRECT --to-port 80
sudo ssh -gL 8080:127.0.0.1:80 localhost



iptables -t nat -A PREROUTING -i eth1 -p tcp --dport 80 \
        -j REDIRECT --to-port 8080

>>>>>>>>>>

sudo systemctl enable HealMeFit3.service
sudo systemctl disable HealMeFit3.service
sudo systemctl start HealMeFit3.service
sudo systemctl restart HealMeFit3.service
sudo systemctl status HealMeFit3.service
note:

Created symlink from /etc/systemd/system/multi-user.target.wants/HealMeFit3.service to /etc/systemd/system/HealMeFit3.service.


>>>>>>>>>>Healmefit3.service

[Unit]
Description=HealMeFit3
After=multi-user.target

[Service]

ExecStart=/usr/bin/node /home/ec2-user/heal-me-fit-backend/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=HealMeFit3
User=ec2-user
EnvironmentFile= /home/ec2-user/heal-me-fit-backend/.env

[Install]
WantedBy=multi-user.target 


>>>>>>>>>>>>>>
   sudo vim /etc/systemd/system/HealMeFit3.service   
    sudo ls /etc/systemd/system/HealMeFit3.service    
    sudo view /etc/systemd/system/HealMeFit3.service   
    sudo vim /etc/systemd/system/HealMeFit3.service   

vim +help\ /etc/systemd/system/HealMeFit3.service  


@@ Notes: To don't use
/* detail
- text in red
+ text in green
! text in orange
# text in gray
@@ text in purple (and bold)@@
*/ detail
