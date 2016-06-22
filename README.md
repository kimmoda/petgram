# Getting Started with Photogram 

## Requirements

 1. Install Node Version Manager (NVM) and NodeJS v5.11.1
	 2. Windows: https://github.com/coreybutler/nvm-windows
	 3. Ubuntu: wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
	 4. Mac: curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
	 5. after install run this command 

		**nvm install v5.11.1**
		**nvm alias default v5.11.1**
		exit terminal and access again
 2. Create your Parse Server 
	 2. clone this repository https://github.com/photogram/server 
	 3. enter in repository and run **npm install**
	 4. install pm2 with **npm install -g pm2**
	 5. edit **ecosystem.json** file in your server folder with your credentials
	 6. run server with **pm2 start ecosystem.json**
	 7. Enter in http://localhost:1337/#/install and create admin User
 3.  Ionic Application
	 4. Clone https://github.com/photogram/ionic-app-parse
	 5. Enter in folder and type **npm install**
	 6. Install Ionic Requeriments **npm install -g ionic cordova**  
	 6. Edit **src/app/index.constant.js** file with your server address and credentials
	 7. Edit files in **src/ folder**
	 8. Type **gulp server** for start browsersync for your development files in src folder
	 9. Type **gulp clean** for clean www folder and after type **gulp build** for create new build in www folder
	 10. For add platform you type **ionic platform add android** , you can change android for other platform, sample iOS

More information in [Photogram Wiki](https://github.com/photogram/server/wiki) 

Some features are in the testing phase as the images of the filter case is commenting the code, search for strings, hashtags and geolocation and the part of followers, I'm working every day to finalize these new features and soon will be posting various tutorials the Photogram.

If you have any questions send me via whatsapp 55 11 949146353 or by email at photogram.ionic@gmail.com

Thank you