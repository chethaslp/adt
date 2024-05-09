"use client"

import { addCls } from "@/components/fb/db";
import { User } from "firebase/auth";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";


let auth:{ token: string };

if(!(typeof window === "undefined")) auth = { token: localStorage.getItem("access_token") || ""}

// "1NZYHpq_NTMHUrka4kSj6kXYGGk5qCDR6lIuX03x7-nk"
export async function createSheetFromTemplate({template, title, sub_name, user}: {template: {adm: string, batch: string, id:string}, title?: string, user: User, sub_name : string }){
    /* Create a new GSheet and copy the contents from template to that sheet. */
    const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(auth, { title: title });
    const sourceDoc = new GoogleSpreadsheet(template.id,auth)


    return sourceDoc.loadInfo()
    .then(()=>sourceDoc.sheetsByIndex[0].copyToSpreadsheet(doc.spreadsheetId))
    .then(() => doc.deleteSheet(0))
    .then(()=> doc.sheetsByIndex[0].updateProperties({title:title || "Untitled Spreadsheet"}))
    .then(()=> addCls(user, { adm: template.adm, title: title || "Untitled Spreadsheet", sub_name:sub_name, batch: template.batch, sid: doc.spreadsheetId, templt_id: template.id}))
    .then(()=> doc)
    
}

export async function addAttentenceData(data:[string], sheetId:string){
    const doc = new GoogleSpreadsheet(sheetId,auth)
    await doc.loadInfo(); // loads sheets
    const sheet:GoogleSpreadsheetWorksheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow(2);
    // @ts-ignore
    window.sheet = sheet;
    const lastIndex = await getLastColumnLetter(sheet)
    const stData = await getStudents(null,sheet)
    console.log(stData)
    stData.forEach( (st:Array<string>, i:number) => {
        sheet.getCell(i+2,sheet.headerValues.length-1).value = data[i]
    })
    sheet.saveUpdatedCells()
    // const rows = await sheet.getCellsInRange(`${lastIndex}2:${lastIndex}`)
    // console.log(rows)


}

export async function getStudents(sheetId=null, sheet?:GoogleSpreadsheetWorksheet){
    if(!sheet){
        if(!sheetId) return
        const doc = new GoogleSpreadsheet(sheetId,auth)
        await doc.loadInfo(); // loads sheet
        sheet= doc.sheetsByIndex[0];
    }
    return sheet.getCellsInRange("A3:C")
}




//  UTIL FUNCTIONS

async function getLastColumnLetter(sheet:GoogleSpreadsheetWorksheet){
    await sheet.loadCells({
        'startColumnIndex':sheet.headerValues.length-1,
        'endColumnIndex':sheet.headerValues.length,
        startRowIndex: 2
    })
    return sheet.getCell(2,sheet.headerValues.length-1).a1Column
}