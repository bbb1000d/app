# Study Capture MVP

A tiny FastAPI + SQLite application that ingests screenshots or raw text, runs OCR, stores the extracted content with tags, and exposes lightweight search and filtering along with a no-build HTML dashboard plus a dedicated Expo/React Native mobile app.

## Features
- Text capture API with tagging and source metadata.
- Screenshot upload endpoint that performs OCR via `pytesseract` and automatically stores the transcript.
- SQLite persistence through SQLModel, so the entire dataset lives in a single `storage.db` file.
- Keyword + tag search endpoint plus optional date filters.
- Static frontend (`frontend/index.html`) that lets you paste text, upload screenshots, and browse/search the latest entries without any build tooling.
- Mobile client (`mobile/`) built with Expo/React Native featuring quick capture, library, and settings tabs.

## Getting started
1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Install the Tesseract binary** (needed for OCR). On Debian/Ubuntu:
   ```bash
   sudo apt-get update && sudo apt-get install -y tesseract-ocr
   ```
3. **Run the API**
   ```bash
   uvicorn backend.main:app --reload
   ```
4. **Open the UI** at [http://localhost:8000](http://localhost:8000) to capture text, upload screenshots, and search through existing notes.

The first run will create `storage.db` at the project root.

### Mobile app

1. Install dependencies inside the `mobile` folder:
   ```bash
   cd mobile
   npm install
   ```
2. Start Expo and pick a target platform (device, simulator, or web):
   ```bash
   npm run start
   ```
3. Ensure the backend is reachable from your phone/emulator. Update the **Settings** tab inside the app with the correct `http://<your-ip>:8000` URL if it differs from the default `http://127.0.0.1:8000`.

The Capture tab supports both raw text submissions and screenshot uploads through the native document picker, and the Library tab offers keyword + tag search with pull-to-refresh.

## API surface
| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/captures/text` | Save pasted text with optional tags/source metadata. |
| `POST` | `/captures/image` | Upload a screenshot, run OCR, then persist the extracted text. |
| `GET` | `/captures` | List the most recent captures with optional tag filter. |
| `GET` | `/captures/{id}` | Retrieve a single capture. |
| `POST` | `/captures/{id}/tags` | Replace the tags for a capture. |
| `GET` | `/search` | Keyword + tag + date search returning totals and matching captures. |

Request/response models live in `backend/schemas.py` and map directly to the JSON payloads.

## Tech stack
- **Backend**: FastAPI, SQLModel, SQLite, Pillow + pytesseract for OCR.
- **Frontend**: Vanilla HTML/CSS/JS served directly from FastAPI for zero-build simplicity + Expo/React Native mobile client.

## Next steps
- Replace naive SQL `LIKE` filtering with SQLite FTS5 or a vector store for better search.
- Add user accounts plus sync, mobile capture, and richer analytics (non-goals for the MVP but called out in the original plan).
