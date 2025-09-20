import './Text.scss'

export const TextBlock: React.FC<{
  content: string
  fontSize?: 'small' | 'medium' | 'large' | 'xl'
  sectionId?: string
}> = ({ content, fontSize = 'medium', sectionId }) => {
  const getFontSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'font-size-small'
      case 'medium':
        return 'font-size-medium'
      case 'large':
        return 'font-size-large'
      case 'xl':
        return 'font-size-xl'
      default:
        return 'font-size-medium'
    }
  }

  return (
    <section id={sectionId} className="text-block">
      <div className="text-content">
        <div
          className={`text-body ${getFontSizeClass(fontSize)}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}
