const log = console.log;
const inquirer = require('inquirer');
const chalk = require('chalk');
var util = require('util');
const sqlite3 = require('sqlite3')
var moment=require('moment');
const juddate = require('./Judge_date')

const MOVE_LEFT = '\u001b[1000D'
const MOVE_UP = '\u001b[1A'
const CLEAR_LINE = '\u001b[0K'

log(chalk.blue("Ladger system"));
var time_ = new Date();
var time = time_.getFullYear()+"/"+(time_.getMonth()+1)+"/"+time_.getDate();
// var time = moment().format("YYYY/MM/DD");

function Bill(){
    var date;
    var money;
    var remark;
  }
  

const indexlist = {
    type :'list',
    message: chalk.blue('主菜单'),
    prefix:'🛸',
    name: 'items',
    choices: [
        "记账",
        "搜索",
        "统计"
    ]
}

const ladgerlist = [{
    // type: 'date',
    // message: "日期",
    // name: "date",
    // default: time,
    // filter: function(val){
    //     if(val == '') return time;
    //     else return val;
       
    // }    
    type: 'date',
    name: "date",
    message: "日期",
    // transformer: (s) => chalk.bold.red(s),
    filter: (d) => d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate(),
    format: { month: "short", hour: undefined, minute: undefined }
},{
    type: 'input',
    message: '金额',
    name: 'money',
    validate: function(val){
        if (val == "") return "不可为空";
        else return true;
    }
},{
    type: 'input',
    message: '备注',
    name: 'remark',
}];

// 数据库连接
var db = new sqlite3.Database(
    './db/user.db',
    sqlite3.OPEN_READWRITE,
    function (err){
      if(err){
        return console.log(err.message);
  
      }
    //   console.log('suc');
    }
  )
  db.run('CREATE TABLE if not exists user(Date text,Money real,Remark text)', function (err) {
    if (err) {
        return console.log(err)
    }
    // console.log('create table user')
  })
  


 Controller();





function Controller(){
    inquirer.prompt(indexlist).then(data => {

                                                        // 操作逻辑
        if(data.items == "记账"){
            inquirer.registerPrompt("date", require("inquirer-date-prompt"));
            inquirer.prompt(ladgerlist).then(async data => {
                var bill = new Bill();
                bill=data;
                log(bill);
                insert_(bill);
                let k = await menu();
                if(k.items_1=="go_back"){

                    var str=MOVE_UP+CLEAR_LINE;
                    for (i =0 ; i<5 ;i++){
                        str+=MOVE_UP+CLEAR_LINE;
                    }
                   log(str+MOVE_UP);

                    Controller();

                }
                    // log(a);
                    
                    //     var str=MOVE_UP+CLEAR_LINE;
                    //     for (i =0 ; i<5 ;i++){
                    //         str+=MOVE_UP+CLEAR_LINE;
                    //     }
                    //    log(str+MOVE_UP);
                    

               
            })
        }
        else if(data.items == '搜索'){
            inquirer.registerPrompt("date", require("inquirer-date-prompt"));
                inquirer.prompt({
                type: 'date',
                name: "timestamp",
                message: "选择日期",
                transformer: (s) => chalk.bold.red(s),
                filter: (d) => d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate(),
                format: { month: "short", hour: undefined, minute: undefined }
                }
                ).then(async answers => {
                    // console.log(answers.timestamp); // 返回的结果
                    let t = util.format('SELECT Date,Money,Remark FROM user WHERE Date = "%s"',answers.timestamp);
                    var s= await search_(t);
                    if(s != ''){
                        log(s);
                    }else log('null\n');
                    // log(s);
                   let k = await menu();
                    log(k.items_1);
                   if(k.items_1 =="go_back"){

                    var str=MOVE_UP+CLEAR_LINE;
                    for (i =0 ; i<s.length+5;i++){
                        str+=MOVE_UP+CLEAR_LINE;
                    }
                   log(str+MOVE_UP);

                    Controller();

                }
                   
                   
                });
                
               
        }

    else if(data.items == "统计"){
        inquirer.registerPrompt("date", require("inquirer-date-prompt"));
        inquirer.prompt([
            {
            type: 'date',
            name: 'start_time',
            filter: (d) => d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate(),
            format: { month: "short", hour: undefined, minute: undefined },
        },{
            type: 'date',
            name: 'end_time',
            filter: (d) => d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate(),
            format: { month: "short", hour: undefined, minute: undefined }
        }
    ]).then(async a => {
            // log(a);
            jud = juddate.checkEndTime(a.start_time,a.end_time);
            // log(jud);
            if(!jud){
                temp=a.start_time;
                 a.start_time = a.end_time;
                 a.end_time=temp;
            }
            log(a.start_time+"-"+a.end_time);
            // let cl = MOVE_UP+CLEAR_LINE+MOVE_UP+CLEAR_LINE;
            between = juddate.getDaysBetween(a.start_time,a.end_time);
            tm_date=a.start_time;
            var res_list = new Array();
            var query =util.format('"%s" ',a.start_time);
            for (i =0;i<between;i++){
                tm_date=juddate.addDate(tm_date,1);
                // log(tm_date);
                let s = util.format('or Date="%s" ', tm_date);
                
                query+=s;
            }
            sql = util.format('SELECT Date,Money,Remark FROM user WHERE Date = %s',query);
            // db.all(sql, function (err, rows) {
            //     if (err) {
            //         return console.log('find error: ', err.message)
            //     }
        
            //      log(rows);
                //  var money_totail=0;
                // for (var key in rows){
                // money_totail+=rows[key].Money;
                // // log(rows[key].Money);
                // }
                // log("总金额:"+money_totail);

            
            // });

            let s = await search_(sql);
            if(s != ''){
                log(s);
            }else log('null\n');
           
           
            let money_totail=0;
            for (var key in s){
            money_totail+=s[key].Money;
            // log(rows[key].Money);
            }
            log("总金额:"+money_totail);

           let k = await menu();
            // log(k.items_1);
           if(k.items_1 =="go_back"){

             var str=MOVE_UP+CLEAR_LINE;
            for (i =0 ; i<s.length+8;i++){
                str+=MOVE_UP+CLEAR_LINE;
            }
           log(str);
           

             Controller();

        }
        })
    }
    })

}

function menu(){
    return new Promise((reslove,reject)=>{

        inquirer.prompt({
            type: "list",
             message: " ",
             prefix:' ',
            name: "items_1",
            choices: [
               "go_back",
               "exit"
            ],
            
        }).then(data => {
            if(data.items_1 == 'exit') {
                db.close(function (err) {
                    if (err) {
                        return console.log(err.message)
                    }
                    console.log('close database connection');
                })
            }
            reslove(data);
        })

    })
    
    // .then(data => {
    //     if (data.items_1=="go_back") {
    //        Controller(); 
    //     }
    //    else return;
    // })
}


function insert_(d){
    db.run('INSERT INTO user VALUES(?,?,?)',[d.date,d.money,d.remark] , function (err) {
        if (err) {
            return console.log('insert data error: ', err.message)
        }
        // console.log('insert data: ', this);
      })
}


 function search_(d){
    return new Promise(function(resolve,reject){
    db.all(d, function (err, rows) {
        if (err) {
            return console.log('find Alice error: ', err.message)
        }

        resolve(rows);
    })
});
}


