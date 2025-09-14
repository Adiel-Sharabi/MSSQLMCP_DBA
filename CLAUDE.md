# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains MSSQL Database MCP (Model Context Protocol) servers that enable AI assistants like Claude to interact with MSSQL databases through natural language queries. It includes two implementations:

- **Node.js Implementation** (`Node/`): TypeScript-based MCP server with extensive DBA tooling
- **.NET Implementation** (`dotnet/`): C#/.NET 8 console application using the MCP C# SDK

Both implementations provide secure database connectivity and comprehensive MSSQL database management capabilities through MCP tools.

## Architecture

### Node.js Implementation (`Node/`)
- **Entry Point**: `src/index.ts` - Main MCP server implementation
- **Tools Directory**: `src/tools/` - Individual database operation tools:
  - Basic CRUD: `CreateTableTool.ts`, `ReadDataTool.ts`, `InsertDataTool.ts`, `UpdateDataTool.ts`
  - Schema Management: `ListTableTool.ts`, `DescribeTableTool.ts`, `DropTableTool.ts`, `CreateIndexTool.ts`
  - DBA Tools: `sp_BlitzTool.ts`, `sp_WhoisactiveTool.ts`, `sp_PressureDetectorTool.ts`
  - Monitoring: `WaitStatsTool.ts`, `IOHotspotsTool.ts`, `IndexUsageStatsTool.ts`
  - Health Checks: `CheckDBTool.ts`, `CheckConnectivityTool.ts`, `DatabaseStatusTool.ts`
  - Enterprise Features: `AvailabilityGroupsTool.ts`, `BackupStatusTool.ts`, `AgentJobHealthTool.ts`

### .NET Implementation (`dotnet/`)
- **Entry Point**: `MssqlMcp/Program.cs` - Host builder and MCP server setup
- **Tools**: `MssqlMcp/Tools/` - Core database operations (CRUD, schema management)
- **Infrastructure**: `MssqlMcp/SqlConnectionFactory.cs`, `MssqlMcp/ISqlConnectionFactory.cs`

## Common Development Commands

### Node.js Implementation
```bash
cd Node
npm install                 # Install dependencies
npm run build              # Build TypeScript to JavaScript
npm run watch              # Build with file watching
npm start                  # Start the MCP server
```

### .NET Implementation
```bash
cd dotnet
dotnet build               # Build the project
dotnet run --project MssqlMcp    # Run the MCP server
dotnet test                # Run unit tests
```

## Configuration

Both implementations use environment variables for database connectivity:

### Node.js Environment Variables
- `SERVER_NAME` or `SERVER_LIST` - MSSQL server name(s)
- `DATABASE_NAME` - Target database
- `SQL_USER`, `SQL_PASSWORD` - Authentication (if not using Windows/Azure AD)
- `READONLY` - Set to "true" for read-only mode

### .NET Environment Variables
- `CONNECTION_STRING` - Full MSSQL connection string

## MCP Integration

The servers integrate with:
- **VS Code Agent**: Configure in `.vscode/mcp.json` or VS Code settings
- **Claude Desktop**: Configure in `claude_desktop_config.json`

Sample configurations are provided in `Node/src/samples/`.

## Security Features

- Connection pooling and proper resource management
- Read-only mode support via `READONLY` environment variable
- Required WHERE clauses for data operations to prevent full table scans
- Secure credential handling through environment variables

## Tool Categories

1. **Basic Database Operations**: CRUD operations, schema management
2. **DBA Diagnostics**: Stored procedures for performance analysis
3. **Monitoring & Statistics**: Wait stats, I/O analysis, index usage
4. **Health Checks**: Database integrity, connectivity verification
5. **Enterprise Features**: Availability groups, backup monitoring, SQL Agent jobs