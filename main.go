package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

const HTTP_SERVER_PORT = ":80"
const HTTPS_SERVER_PORT = ":443"

//============================================================================
// GO-QUIZZ
//============================================================================

//==================== TYPES
type Quizlet struct {
	Id            uint16
	ChosenProject string
	Question      string
	Option1       string
	Option2       string
	Option3       string
	Option4       string
	Answer        int
}

type Quizzy struct {
	Link     string
	Name     string
	Property string
}

type HomeData struct {
	WelcomeMessage string
	Projects       []Project
}

type Project struct {
	Namespace string
	Objects   []DataObject
}

type DataObject struct {
	Name       string
	Properties []Property
}

type Property struct {
	Value string
}

//==================== FUNCTIONS

func getProjects() []Project {
	files, err := ioutil.ReadDir("./data/")
	if err != nil {
		panic(err)
	}
	var projects []Project

	for _, f := range files {
		projects = append(projects, Project{f.Name(), getObjects(f.Name())})

	}

	return projects
}

func getObjects(namespace string) []DataObject {
	objects, err := ioutil.ReadDir("./data/" + namespace)
	if err != nil {
		panic(err)
	}
	var objs []DataObject

	for _, f := range objects {
		objs = append(objs, DataObject{f.Name()[:(len(f.Name()) - 3)], getProperties("./data/" + namespace + "/" + f.Name())})

	}

	return objs
}

func getProperties(href string) []Property {
	file, err := os.Open(href)
	if err != nil {
		panic(err)
	}
	fileScanner := bufio.NewScanner(file)
	lineCount := 0
	var lines []Property
	for fileScanner.Scan() {
		lineCount++
		l := fileScanner.Text()
		if len(l) <= 1 {
			continue
		}
		lines = append(lines, Property{l})
	}
	return lines
}

func timeStamp() string {
	return time.Now().Format(time.ANSIC)
}

func readQuizzy(prefix string, href string) Quizzy {
	file, err := os.Open(prefix + href)
	if err != nil {
		panic(err)
	}
	fileScanner := bufio.NewScanner(file)
	lineCount := 0
	var lines []string
	for fileScanner.Scan() {
		lineCount++
		lines = append(lines, fileScanner.Text())
	}

	lineTry := rand.Intn(lineCount)
	for len(lines[lineTry]) <= 1 {
		lineTry = rand.Intn(lineCount)
	}

	qz := Quizzy{href, href[:(len(href) - 3)], lines[lineTry]}
	return qz

}

func createQuizlet() Quizlet {
	arcs, err := ioutil.ReadDir("archives/")
	if err != nil {
		panic(err)
	}
	qid := len(arcs)

	projs := getProjects()
	r := rand.Intn(len(projs))
	rd_proj := projs[r].Namespace
	files, err := ioutil.ReadDir("data/" + rd_proj + "/")
	if err != nil {
		panic(err)
	}

	rand.Seed(time.Now().UnixNano())
	candidates := rand.Perm(len(files))
	target := rand.Intn(4)

	qz := Quizlet{uint16(qid), rd_proj, "This is a test question.", "option", "option", "option", "option", target}

	q := readQuizzy("data/"+rd_proj+"/", files[candidates[0]].Name())
	qz.Option1 = q.Name

	q = readQuizzy("data/"+rd_proj+"/", files[candidates[1]].Name())
	qz.Option2 = q.Name

	q = readQuizzy("data/"+rd_proj+"/", files[candidates[2]].Name())
	qz.Option3 = q.Name

	q = readQuizzy("data/"+rd_proj+"/", files[candidates[3]].Name())
	qz.Option4 = q.Name

	q = readQuizzy("data/"+rd_proj+"/", files[candidates[target]].Name())
	qz.Question = q.Property

	file, err := json.MarshalIndent(qz, "", " ")
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile("archives/"+fmt.Sprint(qid)+".json", file, 0666)
	if err != nil {
		panic(err)
	}

	return qz
}

//==================== HANDLERS

func indexHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("index GET")
	t := template.Must(template.ParseFiles("templates/home/index.tmpl"))
	options := struct {
		Message string
	}{
		"Hello world!",
	}

	err := t.Execute(w, options)
	if err != nil {
		panic(err)
	}
}

func quizHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("generate quiz")
	t := template.Must(template.ParseFiles("templates/quiz/quizlet.tmpl"))
	qz := createQuizlet()
	err := t.Execute(w, qz)
	if err != nil {
		panic(err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("welcome home")
	home := HomeData{}
	home.WelcomeMessage = "Available topics"
	home.Projects = getProjects()

	tmpl := template.Must(template.ParseFiles("templates/quiz/home.tmpl"))
	err := tmpl.Execute(w, home)
	if err != nil {
		panic(err)
	}
}

//============================================================================
// MAIN SERVER MUX
//============================================================================

func main() {
	fmt.Printf("Starting mrztti.com backend on port %s\n", HTTP_SERVER_PORT)
	//create a new router
	router := mux.NewRouter()

	// Static file server
	var dir string
	flag.StringVar(&dir, "dir", "./static/", "The directory to serve files from. Defaults to the current dir")
	flag.Parse()
	// This will serve files under http://localhost:8000/static/<filename>
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(dir))))

	//specify endpoints, handler functions and HTTP method
	//QUIZ
	router.HandleFunc("/quiz/new", quizHandler).Methods("GET")
	router.HandleFunc("/quiz/", homeHandler).Methods("GET")

	//HOME
	router.HandleFunc("/", indexHandler).Methods("GET")
	fmt.Println("Set handlers!")

	//start and listen to requests
	srv := &http.Server{
		Handler: router,
		Addr:    "mrztti.com" + HTTP_SERVER_PORT,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	fmt.Println("Listening now!")
	log.Fatal(srv.ListenAndServe())
}
