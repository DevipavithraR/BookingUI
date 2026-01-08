import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";

// 1. Create React Query client
const queryClient = new QueryClient();

// 2. Create Apollo Client instance
const apolloClient = new ApolloClient({
  uri: "https://report-backend.arffy.com/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ApolloProvider>
    </PersistGate>
  </Provider>
);