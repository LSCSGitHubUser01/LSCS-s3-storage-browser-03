"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '../components/StorageBrowser';
import {
  ThemeStyle, createTheme, defineComponentTheme,
} from "@aws-amplify/ui-react/server";
import { View } from "@aws-amplify/ui-react";


Amplify.configure(outputs);

const client = generateClient<Schema>();

const storageBrowserTheme = defineComponentTheme({ name: "storage- browser",
  theme: (tokens) => {
    return {
      _element: {
        controls: {
          flexDirection: "row- reverse",
        backgroundColor: tokens.colors.background.primary,
        padding: tokens.space.small,
        borderRadius: tokens.radii.small,
      },
      title: {
        fontWeight: tokens.fontWeights.thin,
      },
    },
  };
  },
  });

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>

          {/* StorageBrowser Component */}
          <h2>Your Files</h2>
          <StorageBrowser />

        </main>
      )}
    </Authenticator>
  );
}



