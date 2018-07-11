// Ref:
// https://tutorialedge.net/javascript/nodejs/editing-xml-files-with-nodejs/
// https://tohtml.com/ (code highlighter)

// Code:

var fs = require('fs');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');

fs.readFile('test_source.xml', 'utf-8', function (err, data){
    if(err) {
        console.log(err);
        return;
    }

    // console.log(data);

    parseString(data, function(err, result) {
        if(err) {
            console.log(err);
            return;
        }

        var jsonObj = result;

        console.log(jsonObj);
        console.log();
        for (i = 0; i < 2; i++) {
            console.log(jsonObj.Context.Realm[0].Realm[i]);
            console.log();
        }
        for (i = 0; i < 3; i++) {
            console.log(jsonObj.Context.Valve[i]);
            console.log();
        }

        var builder = new xml2js.Builder();
        var xmlObj = builder.buildObject(jsonObj);

        fs.writeFile("test_source_edited.xml", xmlObj, function(err, data) {
            if (err) console.log(err);

            console.log("Did something...?")
        });

    });
});



/*
________________


Xml1 (source):
<?xml version="1.0" encoding="UTF-8"?>

<Context>
       <Realm className="org.apache.catalina.realm.CombinedRealm">
               <Realm className="com.blockmaster.server.realm.UserDatabaseRealm"
                       resourceName="UserDatabase"/>
               <Realm className="com.blockmaster.server.realm.JDBCRealm"/>
               <!--
                <Realm
                                className="com.blockmaster.server.realm.JNDIRealm"
                                connectionURL="ldaps://ldap.datalocker.local:10389"
                                connectionName="betatester@datalocker.local@dist.dlemp.com"
                                connectionPassword="hashpasswd"
                                referrals="follow"
                                adCompat="true"

                                userBase="CN=Users,DC=datalocker,DC=local"
                                userSubtree="true"
                                userSearch="(sAMAccountName={0})"

                                roleBase="DC=datalocker,DC=local"
                                roleSubtree="true"
                                roleSearch="(member={0})"
                                roleName="name"/>
                -->
       </Realm>
       <Valve
                       className="org.apache.catalina.authenticator.SingleSignOn"/>
       <Valve className="com.blockmaster.server.valve.RemoteIPRealmPushValve"/>
       <Valve
                       className="org.apache.catalina.valves.RemoteAddrValve"
                       allow="127\.0\.0\.1,0:0:0:0:0:0:0:1(%\w=)?,.*"/>
</Context>




________________


Xml2 (template):
<?xml version="1.0" encoding="UTF-8"?>

<Context>
        <Realm className="com.blockmaster.server.realm.CombinedRealm">
                <Realm className="com.blockmaster.server.realm.SSORealm"/>        
                <Realm className="com.blockmaster.server.realm.UserDatabaseRealm"
                        resourceName="UserDatabase"/>
                <Realm className="com.blockmaster.server.realm.JDBCRealm"/>

                {ldap-gate-begin}
                <Realm
                                className="com.blockmaster.server.realm.JNDIRealm"
                                connectionURL="{ldap-protocol}://{domain-server}:{ldap-port}"
                                connectionName="{user-name}@{domain-name}"
                                connectionPassword="{user-password}"
                                referrals="{ldap-referrals}"
                                adCompat="true"
        
                                userBase="{domain-user-base}"
                                userSubtree="true"
                                userSearch="(sAMAccountName={0})"
        
                                roleBase="{domain-role-base}"
                                roleSubtree="true"
                                roleSearch="(member={0})"
                                roleName="name"/>
                {ldap-gate-end}
                
        </Realm>
        <Valve className="org.apache.catalina.authenticator.SingleSignOn"/>
        <Valve className="com.blockmaster.server.valve.RemoteIPRealmPushValve"/>
        <Valve
                        className="org.apache.catalina.valves.RemoteAddrValve"
                        allow="127\.0\.0\.1,0:0:0:0:0:0:0:1(%\w+)?,{remote-ip-filter}"/>
</Context>




Xml3 (expected results):
<?xml version="1.0" encoding="UTF-8"?>

<Context>
        <Realm className="com.blockmaster.server.realm.CombinedRealm">
                <Realm className="com.blockmaster.server.realm.SSORealm"/>        
                <Realm className="com.blockmaster.server.realm.UserDatabaseRealm"
                        resourceName="UserDatabase"/>
                <Realm className="com.blockmaster.server.realm.JDBCRealm"/>

                <!--
                <Realm
                                className="com.blockmaster.server.realm.JNDIRealm"
                                connectionURL="ldaps://ldap.datalocker.local:10389"
                                connectionName="betatester@datalocker.local@dist.dlemp.com"
                                connectionPassword="hashpasswd"
                                referrals="follow"
                                adCompat="true"

                                userBase="CN=Users,DC=datalocker,DC=local"
                                userSubtree="true"
                                userSearch="(sAMAccountName={0})"

                                roleBase="DC=datalocker,DC=local"
                                roleSubtree="true"
                                roleSearch="(member={0})"
                                roleName="name"/>
                -->
                
        </Realm>
        <Valve className="org.apache.catalina.authenticator.SingleSignOn"/>
        <Valve className="com.blockmaster.server.valve.RemoteIPRealmPushValve"/>
        <Valve
                        className="org.apache.catalina.valves.RemoteAddrValve"
                        allow="127\.0\.0\.1,0:0:0:0:0:0:0:1(%\w=)?,.*"/>
</Context>
*/