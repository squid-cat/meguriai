import React from 'react';
import { client } from '../utils/api-client';

export default async function Home() {
  const res = await (await client.hello.$get()).json();
  
  return <h1>{res.message}</h1>;
} 