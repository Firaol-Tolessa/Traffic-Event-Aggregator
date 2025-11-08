# 🚦 Traffic Event System



##  architecture

The system is composed of two main backend services and a frontend:

1.  **Ingestor Service  :**
     A lightweight Node.js service.
    * **Role:**  Listens for incoming JSON payloads from cameras..
    * **Action:** Transforms JSON into a GraphQL mutation and forwards it to the Main API.
 
2.  **GraphQL API:**
     A Node.js (Express) server that runs the main business logic.
    * **Role:**  Serves the React frontend and handles all data queries/mutations.
    * **Action:** Connects to a PostgreSQL database (via TypeORM) for persistent storage.
3.  **React Dashboard (The "Frontend"):**
    * A React app (e.g., on port 3000) that consumes the GraphQL API..
---
### Data Flow


<img width="933" height="426" alt="image" src="https://github.com/user-attachments/assets/8cdaa619-63b2-497e-bd66-2b5c77529b59" />



* **Ingestion:** `[Camera Device]` $\rightarrow$ `JSON [Post]` $\rightarrow$ `[Ingestor Service]` $\rightarrow$ `[PostgreSQL DB]`
* **Viewing:** `[Browser]` $\rightarrow$ `[React App]` $\rightarrow$ `[GraphQL Query]` $\rightarrow$ `[PostgreSQL DB]` 

### Frontend Dashboard 

<img width="1898" height="876" alt="image" src="https://github.com/user-attachments/assets/371b479d-0b67-42da-89cc-303d6d74a891" />

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js**
* **npm**
* **PostgreSQL**
* **PostgreSQL** (for the React frontend)
* **Postman** (or a similar tool for API testing)



## 🚀 Setup

Follow these steps to configure and build the project locally.

### 1. Database Setup (GraphQL API)

This service requires a running **PostgreSQL** database.

* Create a new PostgreSQL database (e.g., `traffic_db`).
* Navigate to the `backend/backend/dataSource.js` folder.
* Edit the fields in the Datasource with the postgres data file from the example:

    ```bash
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "youruser",
    password: "yourpassword",
    database: "traffic_aggregator",
    synchronize: true, // TODO : change this to false fo production
    logging: true,
    entities: [Camera, Event],
    migrations: [],
    subscribers: [],
    ```

### 2. Install Dependencies

Open a terminal in the respective root folders and run `npm install`:

* Open a terminal in the **`backend/`** root folder:
    ```bash
    npm install
    ```
* Open a terminal in the **`frontend/`** root folder:
    ```bash
    npm install
    ```

---

## ▶️ Execution

You must start the backend and frontend services in two separate terminals.

### Step 1: Run the GraphQL API (Backend)

1.  Open a terminal in the **`backend/`** root folder.
2.  Run the application:
    ```bash
    npm run dev
    ```
3.  Look for this line in the log to confirm the server is running:
    > **🚀 Server ready at http://localhost:3000/graphql**

### Step 2: Run the React Dashboard (Frontend)

1.  Open a **new** terminal in the **`frontend/`** root folder.
2.  Run the application:
    ```bash
     npm run dev
    ```

### System Operational Status

Your system is now fully operational and accessible at:

* **GraphQL API:** `http://localhost:3000/graphql`
* **React App:** `http://localhost:3000`

---

## 🧪 How to Test

You can test the entire API using a GraphQL client like **Postman** or **Apollo Sandbox** (available at `http://localhost:3000/graphql` if enabled).

### A. Test Aggregates

Retrieve system-wide aggregated data (total events, average speed).

```graphql
query GetAggregates {
  getAggregates {
    totalEvents
    avgSpeed
  }
}
```

### B. Test Pagination (Get First Page

Get the first page of vehicle events (3 items).

```graphql
query getEvents {
  getVehicles(first: 3, after: null) {
    edges {
      cursor
      node {
        id
        vehiclePlate
        speed
        camera {
          location
          model
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
```

### C. Test Filtering

Get all events for a specific vehicle plate.

```graphql
query getVehicle($plate: String!) {
  getVehicle(vehiclePlate: $plate) {
    id
    timestamp
    speed
  }
}
# In your client, use variables: { "plate": "ABC-123" }
```

