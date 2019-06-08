# To connec to the production MongoDB instance you must
# 1. Connect the osu VPN
# 2. Run this script using `. ./environment/production.sh`
#    Without the leading `.` the variables will be set in a sub shell,
#    not your currently running shell.
# 3. Start the server `npm start` `node server.js` or `nodemon server.js`

# Set env variables
export MONGODB_HOST='classmongo.engr.oregonstate.edu'
export MONGODB_NAME='cs290_fortunej'
export MONGODB_USER='cs290_fortunej'
. ./environment/prod-password.sh

echo '☁️  Production database credentials set up.'
