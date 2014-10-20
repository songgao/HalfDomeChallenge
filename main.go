package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	FBAppID     string `json:"fb_app_id"`
	FBAppSecret string `json:"fb_app_secret"`
	ListenAddr  string `json:"listen_addr"`
	LAddrHTTPS  string `json:"laddr_https"`
	DBName      string `json:"db_name"`
	DBAddr      string `json:"db_addr"`
	CACert      string `json:"ca_cert"`
	CAKey       string `json:"ca_key"`
	UIPath      string `json:"ui_path"`

	fbToken string
}

func popDefaults(config *Config) (valid bool) {
	valid = true
	if config.FBAppID == "" {
		config.FBAppID = "<facebook app id>"
		valid = false
	}
	if config.FBAppSecret == "" {
		config.FBAppSecret = "<facebook app secret>"
		valid = false
	}
	if config.LAddrHTTPS == "" {
		config.LAddrHTTPS = "localhost:8443"
	}
	if config.DBName == "" {
		config.DBName = "elcap_dev"
	}
	if config.DBAddr == "" {
		config.DBAddr = "localhost"
	}
	if config.CACert == "" {
		config.CACert = "<path to CA certificate>"
		valid = false
	}
	if config.CAKey == "" {
		config.CAKey = "<path to CA Key>"
		valid = false
	}
	if config.UIPath == "" {
		config.UIPath = "<path to UI path>"
		valid = false
	}
	return
}

func main() {
	if len(os.Args) == 1 {
		fmt.Fprintf(os.Stderr, "Usage: %s config_file\nAn example config_file is being written to stdout.\n", os.Args[0])
		config := new(Config)
		popDefaults(config)
		json.NewEncoder(os.Stdout).Encode(config)
		return
	}
	cf, err := os.Open(os.Args[1])
	if err != nil {
		fmt.Println(err)
		return
	}
	config := new(Config)
	err = json.NewDecoder(cf).Decode(config)
	if err != nil {
		fmt.Println(err)
		return
	}
	if !popDefaults(config) {
		fmt.Println("Invalid config. Field(s) are missing.")
		return
	}
	config.fbToken = config.FBAppID + "|" + config.FBAppSecret
	db, err := ConnectDB(config.DBAddr, config.DBName)
	if err != nil {
		fmt.Println(err)
		return
	}
	server := NewServer(db, config)
	err = server.ListenAndServe()
	if err != nil {
		fmt.Println(err)
		return
	}
}
