import User from './User'

export enum Mood {Normal, Depressed, Anxious, Stressed, Lonely, Happy}

/**
 *  ============================
 *      Model Patients' data
 *  ============================
 */

export default interface Patient extends User{
    mood: Mood
}