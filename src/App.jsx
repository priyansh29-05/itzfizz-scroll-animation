import Hero from './components/Hero/Hero'

function App() {
  return (
    <main>
      <Hero />
      
      {/* Minimal transition section to verify pin release */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderTop: '1px solid var(--color-border)'
      }}>
        <p style={{ 
          color: 'var(--color-text-tertiary)', 
          letterSpacing: '0.2em', 
          fontSize: '0.75rem' 
        }}>
          02 / SELECTED WORKS (COMING SOON)
        </p>
      </section>
    </main>
  )
}

export default App
