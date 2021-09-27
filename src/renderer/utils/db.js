import fse from 'fs-extra';
import path from 'path';
import sq3 from 'sqlite3';
import logger from './logger';
import { docDir } from './settings';
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join(docDir, 'data.sqlite3');
fse.ensureFileSync(dbPath);
console.log('dbpathis===========')
console.log(dbPath)

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  /**
   * 物品表 GOODS
   * name 品名
   * standard_buy_unit_price 标准进价
   * standard_sell_unit_price 标准售价
   * total_amount 总金额
   * total_count 总数量
   * remark 备注
   * create_time 创建时间
   * update_time 修改时间
   */
  db.run(
    `CREATE TABLE IF NOT EXISTS panel(
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name VARCHAR(125) NOT NULL UNIQUE,
      create_time TIMESTAMP NOT NULL,
      update_time TIMESTAMP NOT NULL 
      )`, err => {
        logger(err);
      }
  );

  db.run(`CREATE TABLE IF NOT EXISTS type(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    panel_name VARCHAR(125) NOT NULL,
    name VARCHAR(125) NOT NULL,
    protocol VARCHAR(125),
    create_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP NOT NULL,
    FOREIGN KEY (panel_name) REFERENCES PANEL(name)
    )`, err => {
    logger(err);
  });

  db.run(`CREATE TABLE IF NOT EXISTS device(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    panel_name VARCHAR(125) NOT NULL,
    type_name VARCHAR(125) NOT NULL,
    name VARCHAR(125) NOT NULL UNIQUE,
    protocol VARCHAR(125) NOT NULL,
    station_id INTEGER,
    ip VARCHAR(125),
    port INTEGER,
    client_id INTEGER,
    username  VARCHAR(125),
    password VARCHAR(125),
    create_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP NOT NULL,
    FOREIGN KEY (panel_name) REFERENCES PANEL(name)   
    FOREIGN KEY (type_name) REFERENCES TYPE(name)
    )`, err => {
    logger(err);
  });
});

export default db;
