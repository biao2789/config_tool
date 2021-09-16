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
    name VARCHAR(125) NOT NULL UNIQUE,
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

  db.run(`CREATE TABLE IF NOT EXISTS GOODS(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    standard_buy_unit_price DECIMAL(15,2) NOT NULL,
    standard_sell_unit_price DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    total_count DECIMAL(15,3) NOT NULL,
    remark VARCHAR(255) NOT NULL,
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL
    )`, err => {
    logger(err);
  });

  /**
   * 进出明细表 GOODS_DETAIL_LIST
   * goods_id 物品id
   * count 计数（+加 -减）
   * actual_buy_unit_price 实际进价
   * actual_sell_unit_price 实际售价
   * amount 实际金额
   * remark 备注
   * latest 是否某物品最新一条记录（不是最新操作无法删除）（1是 0不是）
   * create_time 创建时间
   * update_time 修改时间
   */
  db.run(`CREATE TABLE IF NOT EXISTS GOODS_DETAIL_LIST(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    goods_id INTEGER NOT NULL, 
    count DECIMAL(15,3) NOT NULL,
    actual_sell_unit_price DECIMAL(15,2) NOT NULL,
    actual_buy_unit_price DECIMAL(15,2) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    remark VARCHAR(255) NOT NULL,
    latest INTEGER NOT NULL,
    create_time INTEGER NOT NULL,
    update_time INTEGER NOT NULL,
    FOREIGN KEY (goods_id) REFERENCES GOODS(id)
    )`, err => {
    logger(err);
  });
});

export default db;
