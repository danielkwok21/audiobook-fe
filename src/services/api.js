const config = {
    api: 'http://localhost:5000',
    api: 'https://audiobook.hirewithapi.com/api-audiobook'
}

const headers = {
    'Content-Type': 'application/json'
}

export const getBooks = () => {
    return fetch(`${config.api}/books`)
        .then(res => res.json())
}

export const getChapters = (book) => {
    return fetch(`${config.api}/books/${book}`)
        .then(res => res.json())
}

export const getAudio = (book, chapter) => {
    return `${config.api}/chapter/${book}/${chapter}`
}

export const getThumbnail = (book, thumbnail) => {
    return `${config.api}/thumbnail/${book}/${thumbnail}`
}

export const updateProgress = (book, chapter, progress) => {

    return fetch(`${config.api}/progress`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            book,
            chapter,
            progress
        })
    })
        .then(res => res.json())
}
export const getProgress = (book, chapter) => {
    return fetch(`${config.api}/progress/${book}/${chapter}`)
        .then(res => res.json())
}
