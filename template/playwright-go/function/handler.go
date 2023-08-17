package function

import (
	"fmt"
	"log"
	"net/http"

	playwright "github.com/playwright-community/playwright-go"
)

func Handle(w http.ResponseWriter, r *http.Request) {
	err := playwright.Install()
	if err != nil {
		log.Fatalf("failed to install playwright")
	}
	pw, err := playwright.Run()
	if err != nil {
		log.Fatalf("could not start playwright: %v", err)
	}
	browser, err := pw.Chromium.Launch()
	if err != nil {
		log.Fatalf("could not launch browser: %v", err)
	}
	page, err := browser.NewPage()
	if err != nil {
		log.Fatalf("could not create page: %v", err)
	}
	if _, err = page.Goto("https://jonfriesen.ca"); err != nil {
		log.Fatalf("could not goto: %v", err)
	}
	title, err := page.Title()
	if err != nil {
		log.Fatalf("could not get title: %v", err)
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Title: %s", title)))
}
