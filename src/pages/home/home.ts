import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
//import {Toast} from '@ionic-native/toast';
import {AdddataPage} from '../adddata/adddata';
import {EditdataPage} from '../editdata/editdata';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  expenses:any = [];
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  constructor(public navCtrl: NavController,public sqlite:SQLite,  public toast:Toast) {

  }

  ionViewDidLoad(){
    this.getData();
  }

  ionViewWillEnter(){
    this.getData();
  }

  getData(){
    this.sqlite.create({
      name: 'ionicdb.db',location: 'default'
    }).then((db: SQLiteObject)=>{
      db.executeSql('CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INTEGER)',[])
      .then(res => {
        console.log(res);
        this.toast.show('executed', '5000', 'center').subscribe(
          toast =>{
            console.log(toast)
          }
        );
      })
      .catch(e =>{
        console.log(e);
        this.toast.show(e.message, '5000', 'center').subscribe(
          toast =>{
            console.log(toast)
          }
        );
      });
        db.executeSql('SELECT * FROM expense ORDER BY rowid DESC',[])
        .then(res => {
          this.expenses = [];
          for(var i=0; i<res.rows.length; i++){
            //อ่านค่าทุกแถวมาใส่ใน object
            this.expenses.push({
              rowid:res.rows.item(i).rowid,
              date:res.rows.item(i).date,
              type:res.rows.item(i).type,
              description:res.rows.item(i).description,
              amount:res.rows.item(i).amount
            })
          }
        })
        .catch(e =>{
          console.log(e);
          this.toast.show(e.message, '5000', 'center').subscribe(
            toast =>{
              console.log(toast)
            }
          );
        });
        db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"',[])
          .then(res => {
            if(res.rows.length>0){
              this.totalIncome = parseInt(res.rows.item(0).totalIncome);
              this.balance = this.totalIncome-this.totalExpense;
              this.toast.show("Income", '5000', 'center').subscribe(
                toast =>{
                  console.log(toast)
                }
              );
            }
          })
          .catch(e =>{
            console.log(e);
            this.toast.show(e.message, '5000', 'center').subscribe(
              toast =>{
                console.log(toast)
              }
            );
          });
          db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"',[])
          .then(res =>{
            if(res.rows.length>0){
              this.totalExpense=parseInt(res.rows.item(0).totalExpense);
              this.balance = this.totalIncome-this.totalExpense;
            }
            this.toast.show("Expense", '5000', 'center').subscribe(
              toast =>{
                console.log(toast)
              }
            );
          })
    }).catch(e =>{
      console.log(e);
      this.toast.show(e.message, '5000', 'center').subscribe(
        toast =>{
          console.log(toast)
        }
      );
    });
  }

  //ฟังกฺชั่นสำหรับการเรียกเพจ AdddataPage
  addData(){
    this.navCtrl.push(AdddataPage);
  }

  //ฟังก์ชันสำหรับเรียกเพจ EditdataPage ขึ้นมาแสดงผล ดดยแนบตัวแปร rowid ไปด้วย
  editData(rowid){
    this.navCtrl.push(EditdataPage,{rowid:rowid});
  }

  //ฟังก์ชั่นสำหรับลบข้อมูลโดยรับค่า rowid มาแล้วทำการลบจากฐานข้อมูล
  deleteData(rowid){
    this.sqlite.create({
      name: 'ionicdb.db', location:'default'
    }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM expense WHERE rowid=?', [rowid])
        .then(res => {
          console.log(res);
          this.getData();
        })
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
}
