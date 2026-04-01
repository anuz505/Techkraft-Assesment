import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavoriteCheck } from "@/hooks/queries/use-favorite-check"
import { useFavoriteMutations } from "@/hooks/mutations/use-favorite-mutations"

interface FavoriteToggleProps {
  propertyId: string
}

function FavoriteToggle({ propertyId }: FavoriteToggleProps) {
  const { data, isLoading } = useFavoriteCheck(propertyId)
  const { addFavorite, removeFavorite, isMutating } = useFavoriteMutations()

  const isFavorited = !!data?.is_favorited

  const handleToggle = async () => {
    if (isFavorited) {
      await removeFavorite(propertyId)
      return
    }

    await addFavorite(propertyId)
  }

  return (
    <Button
      variant={isFavorited ? "secondary" : "outline"}
      onClick={handleToggle}
      disabled={isLoading || isMutating}
      type="button"
    >
      <Heart className={isFavorited ? "fill-current" : ""} />
      {isFavorited ? "Saved" : "Save"}
    </Button>
  )
}

export default FavoriteToggle
