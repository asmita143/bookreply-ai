# 🤖 AI-Assisted Restaurant Booking System (MCP-Powered)
**Bachelor’s Thesis Project | Metropolia University of Applied Sciences**

A high-performance automation system built to transform unstructured customer emails into structured restaurant operations. This project leverages **FastAPI** and the **Model Context Protocol (MCP)** to create an intelligent bridge between Large Language Models and backend databases.

## 🌟 Key Features
* **Intent Classification:** Automatically categorizes emails into *Booking*, *Cancellation*, or *General Inquiry*.
* **Information Extraction:** Uses AI to identify key entities like dates, times, and guest counts from natural language.
* **Availability Logic:** The backend verifies table availability in real-time before generating responses.
* **Human-in-the-Loop (HITL):** A React-based admin dashboard allows staff to review and approve AI-generated drafts.
* **MCP Integration:** Implements the Model Context Protocol to standardize how the AI model accesses restaurant resources and tools.



## 🛠️ Tech Stack
* **Backend:** Python 3.x, **FastAPI** (Asynchronous High-Performance Framework)
* **Frontend:** React, TypeScript,
* **Database:** Google Firebase Firestore (Real-time NoSQL)
* **AI Engine:** OpenAI API (GPT Models)
* **Communication:** Gmail API for automated ingestion and response handling
* **Protocol:** Model Context Protocol (MCP)

## 📐 System Architecture
1.  **Ingestion:** Incoming emails are fetched via the Gmail API.
2.  **Processing (FastAPI):** The backend triggers an AI workflow to detect intent and extract data.
3.  **Context Management:** MCP provides the AI with the necessary context (menu, availability, rules) to generate an accurate response.
4.  **Database Interaction:** Results are stored in Firestore for persistence and real-time dashboard updates.
5.  **Final Approval:** Staff sends the response through the dashboard with a single click.



## 📈 Evaluation & Results
* **Response Efficiency:** Reduced average manual handling time from ~10 minutes to under 5 seconds.
* **Data Accuracy:** Achieved high precision in entity extraction for structured requests.
* **Resource Optimized:** Utilized FastAPI’s asynchronous capabilities to handle multiple concurrent email threads efficiently.

## 📂 Repository Structure
* `/backend`: FastAPI server, AI logic, and MCP tool definitions.
* `/frontend`: TypeScript/React admin dashboard.
* `/docs`: Thesis documentation and architectural diagrams.

## 📝 License
Developed as a Bachelor’s Thesis at Metropolia UAS. All rights reserved.
