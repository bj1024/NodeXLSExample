import {parse} from "csv-parse";
import * as fs from 'fs';
// import * as readline from "readline"

// ヒアドキュメント
let str = `
ヒアドキュメント（別の呼び方としてヒア文字列、heredocなど）は、
文字列リテラルを、シェルスクリプトやプログラミング言語のソースコード中に埋め込むための1つの方法である。

ヒアドキュメント - Wikipedia
https://ja.wikipedia.org/wiki/%E3%83%92%E3%82%A2%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88
`
console.log(str)
console.debug(`pwd=[${process.cwd()}]`);


const iconv = require('iconv-lite');

try {


  const fname = `./data/data_sjis_excelexport.csv`

  // read entire file.
  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) {
      console.error(`file read error.[${err}]`)
      return
    }
    console.error(`file contents. read length=[${data.length}]`)
  })

  // read stream
  const parser = parse({delimiter: ',', columns: true});
  const stream = fs.createReadStream(fname)
      .pipe(iconv.decodeStream("Shift_JIS"))  // pipeにwriteableを指定する。
      .pipe(parser) ///
    // .pipe(writer)
  ;

  //
  const records: any = []
  parser.on('readable', () => {
    let record;
    while ((record = parser.read()) !== null) {
      record['no'] = parseInt(record['no'])
      // console.debug(record['no'],typeof record['no'])
      // console.debug(record)

      for (let [key, value] of Object.entries(record)) {
        console.debug('key:' + key + ' value:' + value, typeof value);
      }
      records.push(record);
    }
  });
  parser.on('close', () => {

    console.debug('on close', records);

    const jsonstr = JSON.stringify(records, null, 2)
    console.debug('jsonstr = ', jsonstr);

    // 書き込み
    fs.writeFile("./out/data.json", jsonstr, (err) => {
      if (err) throw err;
      console.log('succeed.');
    });
  })

  //
  // var reader = readline.createInterface({input: stream});
  // reader
  //   .on("line", (line: string) => {
  //       // console.debug(`[${line}]`)
  //       writer.write(line + "\r\n");
  //
  //     //
  //     //   console.debug(`records=[${records}]`)
  //     // for (const record of records) {
  //     //   console.log(record);
  //     // }
  //
  //     })
  //
  //   .on('close', () => {
  //     console.log('Have a great day!');
  //     writer.end();
  //     process.exit(0);
  //   });

} catch (e) {
  console.error(`erorr.[${e}]`)
} finally {

}

