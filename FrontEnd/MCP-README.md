# MCP Database Assistant for Mveledziso PMT

This integration allows you to query your PostgreSQL database using natural language through the Model Context Protocol (MCP).

## Setup Instructions

### 1. Install Required Dependencies

```bash
# Install MCP client and server dependencies
npm install @modelcontextprotocol/client @modelcontextprotocol/server-postgres
```

### 2. Configure the API Route

The application includes an API route at `/app/api/mcp-postgres/route.ts` that connects to your PostgreSQL database using MCP. Make sure you have Next.js API routes set up in your project.

### 3. Starting the MCP Server

Before running your application, you need to start the MCP server to connect to your PostgreSQL database:

```bash
# Start the MCP Postgres server
npx @modelcontextprotocol/server-postgres postgresql://postgres.qcnrktarwpbttzllymkf:&D9tK@eR*5zQ#1hW!LxP%7Uv@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

Alternatively, you can use the provided configuration:

```bash
# Using the mcp-config.json
npx @modelcontextprotocol/cli start -c mcp-config.json
```

### 4. Running the Application

Start your Next.js application as usual:

```bash
npm run dev
```

Then navigate to `/database-assistant` to use the Database Assistant.

## Usage

The Database Assistant allows you to:

- Query your database using natural language
- View results in a conversational format
- Ask about projects, team members, documents, and tasks

### Example Queries

- "Show me all projects"
- "List all team members"
- "Show me documents created in the last month"
- "Count tasks by status"
- "Find overdue tasks"

## Customization

You can customize the queries and response formatting by modifying the following functions in the `DatabaseAssistant` component:

- `mapQueryToSQL`: Converts natural language to SQL queries
- `formatResultsAsText`: Formats SQL results as conversational text

## Security Considerations

The current implementation sends raw SQL to your database. In a production environment, you should:

1. Implement proper authentication and authorization
2. Validate and sanitize user input
3. Use parameterized queries to prevent SQL injection
4. Limit the database user permissions to read-only access if possible

## Troubleshooting

If you encounter issues:

1. Check that the MCP server is running
2. Verify the database connection string
3. Check the API logs for errors
4. Ensure you have the correct database schema 