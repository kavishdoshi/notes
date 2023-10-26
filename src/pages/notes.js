import Head from 'next/head'
import { useState, useEffect, use } from 'react'
import TransitionEffect from '@/components/TransitionEffect'
import StickyNoteList from '@/components/StickNoteList'
import Cookies from 'js-cookie'

export  default function Notes() {

    const userHash = Cookies.get('UserId');
    const [notes, setNotes] = useState([]);

    const getNotes = async () => {

          
        const response = await fetch(`https://loginlogoutbackend.azurewebsites.net/notes/get`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userHash
        });

        const map = new Map(Object.entries(await response.json()));
        const result = Array.from(map.values());
        console.log(result);
        setNotes([
            ...result
        ]);
    }

    const handleAddNote = async (note) => {

        const data = {
            note: note,
            date: new Date().toLocaleDateString(),
            id: 1,
            colour: "bg-yellow-500",
            userhash: userHash
        }

        await fetch('https://loginlogoutbackend.azurewebsites.net/notes/add', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        await getNotes();
    }

    const handleDeleteNote = async (id) => {

        const data = {
            id: id,
            userhash: userHash
        }
        await fetch('https://loginlogoutbackend.azurewebsites.net/notes/delete', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        await getNotes();
        
    }

    useEffect(() => {
        getNotes();
    }, []);


    return (
        <>
            <Head>
                 <title> Kavish | Notes</title>
                <meta name="description" content='Notes Page' />
            </Head>
            <TransitionEffect />

            <main className='text-dark w-full min-h-screen dark:text-light'>
                <StickyNoteList notes={notes} handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote}/>
            </main>
        </>
    )
}