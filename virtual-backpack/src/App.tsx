import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import './App.css'
import ToDoApp from "./components/todo/ToDoComponent.tsx"
import {v4 as uuidV4} from "uuid";
import CalendarApp from "./components/Calendar/CalendarApp.tsx"
import { useMemo } from "react"
import { useLocalStorage } from "./components/Notebook/useLocalStorage.ts"
import { NoteList } from "./components/Notebook/NoteList.tsx"
import EditNote from "./components/Notebook/EditNote.tsx"
import NewNote from "./components/Notebook/NewNote.tsx"
import { Note } from "./components/Notebook/Note.tsx"
import { NoteLayout } from "./components/Notebook/NoteLayout.tsx"
import ID from "./components/ID/ID.tsx"
import Flashcards from "./components/Flashcards/Flashcard.tsx"
import Homepage from "./components/Homepage/homepage.tsx";

export type Note = {
  id: string
}& NoteData

export type RawNote ={
  id: string
}& RawNoteData

export type RawNoteData = {
  title: string 
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string 
  markdown: string
  tags: Tag[]
}
export type Tag = {
  id: string 
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])
  const idComponent = useMemo(() => <ID />, []);
  
    const notesWithTags = useMemo(() => {
        return notes.map(note =>{
            return {...note,tags: tags.filter(tag => note.tagIds.includes(tag.id))}
        })
    }, [notes,tags])

    function onCreateNote({tags, ...data}: NoteData){
        setNotes(prevNotes => {
            return [...prevNotes,{...data, id:uuidV4(), tagIds: tags.map(tag => tag .id)},
            ]
        })
    }

    function addTag(tag: Tag){
        setTags(prev => [...prev, tag])
    }

    function onDeleteNote(id: string){
        setNotes(prevNotes => {
            return prevNotes.filter(note=> note.id !==id)
        })
    }

    function onUpdateNote(id: string, {tags, ...data}: NoteData){
        
        setNotes(prevNotes => {
            return prevNotes.map(note => {
                if (note.id === id){
                        return{...note,...data,tagIds: tags.map(tag => tag .id)}
                }
                else{
                    return note
                }
            })
        })
    }

    function updateTag(id:string,label:string){
            
        setTags(prevTags => {
            return prevTags.map(tag => {
                if (tag.id === id){
                    return {...tag,label}
                }
                else{
                    return tag
                }
            })
        })
    }

    function deleteTag(id:string){
        
        setTags(prevTags => {
            return prevTags.filter(tag=> tag.id !==id)
        })
    } //terrible code. I am so sorry to whoever wants to modifty and or read this stuff. One of the members (Gh0sty23) did not know how to code in react
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route 
                path="/notes" 
                element={
                    <NoteList 
                        notes ={notesWithTags} 
                        availableTags={tags} 
                        onDeleteTag={deleteTag}
                        onUpdateTag={updateTag} />
                    }
               />
               <Route path="/new" element={<NewNote 
                    onSubmit={onCreateNote} 
                    onAddTag={addTag}  
                    availableTags={tags}/>} />
                <Route path ="/:id" element ={<NoteLayout 
                notes={notesWithTags}/>}>
                    <Route index element ={<Note onDelete= {onDeleteNote}/>}/>
                    <Route path ="edit" element ={<EditNote 
                        onSubmit={onUpdateNote} 
                        onAddTag={addTag}
                        availableTags={tags}/>}/>
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/calendar" element={<CalendarApp />} />
            <Route path="/todo" element={<ToDoApp />} />
            <Route path="/id" element={idComponent} />
            <Route path="/" element={<Homepage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
