import { QueryDocumentSnapshot, CollectionReference, DocumentReference } from "firebase/firestore"


/*
    Data Interface for `Command Messages`
*/
export interface Command {
    type: "createTeam" | "joinTeam" | "validateQuest" | "awardQP";
    qid: string;
    data: string;
}

export interface Player {
    u: DocumentReference;
    role : 'captain' | 'logger' | 'navigator' | 'warrier' | 'unassigned'
}

export interface QP {
    qpid: string;
    value:Number;
    type: 'quest' | 'bonus';
    tm?: string | Number
}
/*
    Data Type for `Question`
*/
export type Question = {
    id: string
    q: string
    flag: string
    hint: string
}

/*
    Data Type for `Quest`
*/
export type Quest = {
    metadata: QuestMetadata 
    qs?: CollectionReference<Question>
    ts?: CollectionReference<Team>
    qp?: CollectionReference<QP>
}

export type QuestMetadata = {
    id: string
    name: string
    desc: string
    host?: string
    img?: string

    startTime?: Number
    endTime?: Number
    active?:boolean

    TOTAL_ALLOWED_MEMBERS?: Number
    MAX_BONUS?: Number
}

/*
    Data Type for `Team`
*/
export type User =  {
    uid: string
    name: string
    email: string
    dp: string
}

/*
    Data Type for `Team`
*/
export type Team = {
    id: string
    name?: string
    lead: DocumentReference
    members?: CollectionReference

    qp?: Number
    cq?: Question | ""
    qpLog?: CollectionReference
}


export const GenericConverter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
  });