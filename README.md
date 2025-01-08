# AskSphere
# Decentralized Platform Flowchart

```mermaid
flowchart TD
    subgraph User Interaction Layer
        U[Users] -->|Ask questions| AI[AI Model]
        U -->|Vote/Comment| C[Content Interface]
    end

    subgraph AI Layer
        AI -->|Reference| VD[Video Database]
        AI -->|Generate responses| R[Response]
        R -->|Include| VC[Video Clips]
    end

    subgraph Incentive System
        C -->|Calculate| RS[Reputation Score]
        RS -->|Trigger| UR[User Rewards]
        UR -->|Grant| FS[Free Subscription]
    end

    subgraph Revenue Streams
        P[Premium Users] -->|Subscribe| REV[Revenue Pool]
        AD[Advertisers] -->|Ad spend| REV
        API[API Users] -->|Usage fees| REV
    end

    subgraph Distribution
        REV -->|Platform cut| PL[Platform]
        REV -->|Node operators| NO[Node Operators]
        REV -->|Content creators| CR[Content Creators]
        REV -->|Active users| U
    end


    classDef primary fill:#000000,stroke:#333;
    class U,AI,REV primary


    classDef primary fill:#000000,stroke:#333;
    class U,AI,REV primary
````
