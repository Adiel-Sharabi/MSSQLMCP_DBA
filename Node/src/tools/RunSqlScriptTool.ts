import sql from "mssql";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class RunSqlScriptTool implements Tool {
  [key: string]: any;
  name = "run_sql_script";
  description = "Executes arbitrary SQL scripts on the database. This tool is only available when ALLOW_SQL_SCRIPTS environment variable is set to 'true'. Use with extreme caution as it can execute any SQL command including destructive operations.";
  
  inputSchema = {
    type: "object",
    properties: {
      script: { 
        type: "string", 
        description: "SQL script to execute. Can contain multiple statements separated by semicolons. Use with caution as this can execute any SQL command." 
      },
      serverName: {
        type: "string",
        description: "Optional server name to connect to. If not provided, uses the first server from SERVER_LIST or SERVER_NAME environment variable."
      },
    },
    required: ["script"],
  } as any;

  async run(args: any): Promise<any> {
    const { script, serverName } = args;

    // Check if SQL scripts are allowed via environment variable
    const allowSqlScripts = process.env.ALLOW_SQL_SCRIPTS?.toLowerCase();
    if (allowSqlScripts !== 'true') {
      return {
        content: [{
          type: "text",
          text: "SQL script execution is disabled. To enable this feature, set the ALLOW_SQL_SCRIPTS environment variable to 'true'. This feature should be used with extreme caution as it allows execution of any SQL command."
        }]
      };
    }

    // Validate input
    if (!script || typeof script !== "string") {
      return {
        content: [{
          type: "text",
          text: "Error: Script parameter is required and must be a string."
        }]
      };
    }

    try {
      // Execute the SQL script
      const request = new sql.Request();
      const result = await request.query(script);

      // Format the response
      let response = "SQL script executed successfully.\n\n";
      
      // Handle multiple result sets
      if (Array.isArray(result.recordsets) && result.recordsets.length > 0) {
        result.recordsets.forEach((recordset: any[], index: number) => {
          if (recordset.length > 0) {
            response += `Result Set ${index + 1}:\n`;
            response += `Rows returned: ${recordset.length}\n`;
            
            // Show first few rows as sample
            const sampleRows = recordset.slice(0, 5);
            if (sampleRows.length > 0) {
              response += "Sample data:\n";
              response += JSON.stringify(sampleRows, null, 2) + "\n";
              
              if (recordset.length > 5) {
                response += `... and ${recordset.length - 5} more rows\n`;
              }
            }
            response += "\n";
          }
        });
      }

      // Show rows affected if available
      if (result.rowsAffected && result.rowsAffected.length > 0) {
        const totalAffected = result.rowsAffected.reduce((sum: number, count: number) => sum + count, 0);
        response += `Total rows affected: ${totalAffected}\n`;
      }

      return {
        content: [{
          type: "text",
          text: response
        }]
      };

    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `Error executing SQL script: ${error.message || 'Unknown error occurred'}`
        }]
      };
    }
  }
}