type PropertyChangeListener = (propertyId: string | null) => void

class PropertyStateManager {
  private currentPropertyId: string | null = null
  private listeners: Set<PropertyChangeListener> = new Set()

  setPropertyId(propertyId: string | null) {
    this.currentPropertyId = propertyId
    this.notifyListeners()
  }

  getCurrentPropertyId(): string | null {
    return this.currentPropertyId
  }

  subscribe(listener: PropertyChangeListener): () => void {
    this.listeners.add(listener)

    listener(this.currentPropertyId)

    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentPropertyId))
  }
}

export const propertyStateManager = new PropertyStateManager()
