import { findById } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import dayjs from "dayjs";
import { insert } from "../repositories/rechargeRepository";

export async function recharge(apiKey: any, cardId: number, amount: number){
    await findCompany(apiKey);
    const card: any = await getCard(cardId);
    isActive(card.password);
    checkValidity(card.expirationDate);
    await insert({
        cardId, 
        amount: amount
    })
}

async function findCompany(apiKey: any): Promise<object> {
    const company: object = await findByApiKey(apiKey);
    if( company ){
        return;
    }
    throw {type: "Not Found", message: "Company not found!"};
}

async function getCard(id: number): Promise<object>{
    const card = await findById(id);
    if(card){
        return card;
    }
    throw {type: "Not Found", message: "Card not found!"};
}

function isActive(password: string){
    if (password){
        return;
    }
    throw {type: "Forbidden", message: "Card inactive!"};
}

function checkValidity(expirationDate: string){
    if(dayjs(Date.now()).isBefore(`01/${expirationDate}`, 'month')){
        return;
    }
    throw {type: "Forbidden", message: "Card out of validity!"};
}