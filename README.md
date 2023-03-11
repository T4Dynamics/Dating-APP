# Dating React Native App 🏓
A quick run down on the work flow and project. Will update this more later to clean it up a bit and if any further questions appear. If you have any questions, feel free to ask!

## 📑 Table of Contents
**[🖥️ Github Work Flow](#%EF%B8%8F-github-work-flow)**<br>
&nbsp;&nbsp;&nbsp;*[Branch Conventions](#Branch-Conventions)*<br>
&nbsp;&nbsp;&nbsp;*[Creating a new branch](#Creating-a-new-branch)*<br>
&nbsp;&nbsp;&nbsp;*[Rebasing a branch to get latest master updates](#Rebasing-a-branch-to-get-latest-master-updates)*<br>
**[📃 First Time Installation](#-first-time-installation)**<br>
**[📱Running The App](#-running-the-app)**<br>

### ⚡ Technologies
![JavaScript](https://img.shields.io/badge/-JavaScript-black?style=flat-square&logo=javascript)
![Nodejs](https://img.shields.io/badge/-Nodejs-black?style=flat-square&logo=Node.js)
<img alt="npm" src="https://img.shields.io/badge/-NPM-CB3837?style=flat-square&logo=npm&logoColor=white" />

## 🖥️ Github Work Flow
When working on a feature (such as login for instance), you should not be working directly in master. You should make a new branch and work on it there. Once it is completed and you are happy with it, you then open a merge request and merge it to master. If you are not completely confident, you can get another team member to review it. 

### Branch Conventions
When working on a **feature** you should create a new branch with the following convention:
- feature/branch-name<br>

When working on a **fix** you should create a new branch with the following convention:
- fix/branch-name

> __Unless you are making a core change, you should never directly commit to master!!__

### Creating a new branch
- Open a bash terminal in the code base and run `git fetch --all`
- If you are not in master run `git checkout master`. If you are, ignore this step. 
- Run `git reset --hard origin/master` to get the latest version of master locally
- Run `git checkout -b "feature/BRANCH-NAME"` to create and go to your new branch. 
- Done! Do all your feature in this branch

### Rebasing a branch to get latest master updates
In the event you have been working on a feature and master has had changes since, you should rebase your branch to incorportate the changes of master in your branch.
- Open a bash terminal in the code base and run `git fetch --all`
- If you are not in master run `git checkout master`. If you are, ignore this step. 
- Run `git reset --hard origin/master` to get the latest version of master locally
- Run `git checkout "feature/BRANCH-NAME"` and go to the branch you want to rebase
- Run `git rebase origin/master` and follow the steps accepting incoming or current changes based on what you need
- Once done, run `git push --force` to complete the rebase!

## 📃 First Time Installation

- Make a copy of the repo in a location of your choosing
- Run `npm install --global expo-cli` to install the EXPO CLI globally
- Open a terminal inside of the code base and run `npm install` to install all dependencies 
- Installation Completed!

## 📱 Running the app
- Open a terminal inside the code base and run `npm run start`
- (Optional) Install the Expo Go app on your phone 
- Scan the QR code shown in the terminal with your phone or launch the virtual phone option
- (Optional) To view the code on your PC use an [Android Emulator](https://www.youtube.com/watch?v=aBTNUpp72ik) and run `npm run android`