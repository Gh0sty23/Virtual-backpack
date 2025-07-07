import { FormEvent, useRef, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
import { NoteData, Tag } from "../../App"
import { v4 as uuidV4 } from "uuid"

type NoteFormProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<NoteData>


export function NoteForm({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] }: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const maxTags = 10;
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const cleanedTitle = titleRef.current!.value.trim();
    const cleanedMarkdown = markdownRef.current!.value.trim();

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // e.g., "2025-06-29"
    const time = now.toTimeString().split(" ")[0]; // e.g., "13:45:20"
    if (cleanedTitle === '' || cleanedMarkdown === '') {
      alert('Input cannot be empty!!');
    } else {
      onSubmit({
        title: cleanedTitle,
        markdown: cleanedMarkdown,
        tags: selectedTags,
        dateCreated: date,
        timeCreated: time,
        dateLastUpdated: "",
        timeLastUpdate: "",
      })
      navigate("/notes");
    }

  }
  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                ref={titleRef}
                required
                defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={label => {
                  const trimmedLabel = label.trim();
                  if (trimmedLabel === "") {
                    alert("Cannot create empty tag");
                    return;
                  }
                  if (selectedTags.length >= maxTags) {
                    alert("Cannot create more than 10 tags");
                    return
                  } else {
                    const newTag = { id: uuidV4(), label }
                    onAddTag(newTag)
                    setSelectedTags(prev => [...prev, newTag])
                  }
                }}
                value={selectedTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                options={availableTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                onChange={tags => {
                  setSelectedTags(tags.map(tag => {
                    return { label: tag.label, id: tag.value }
                  }))
                }}
                isMulti />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            ref={markdownRef}
            required as="textarea"
            rows={15} />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="outline-primary">
            Save
          </Button>
          <Link to="/notes">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}
