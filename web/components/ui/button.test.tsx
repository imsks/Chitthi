import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
	it("renders accessible label text", () => {
		render(<Button type="button">Save draft</Button>)
		expect(screen.getByRole("button", { name: "Save draft" })).toBeInTheDocument()
	})

	it("honours disabled state", () => {
		render(
			<Button type="button" disabled>
				Unavailable
			</Button>
		)
		expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled()
	})
})
