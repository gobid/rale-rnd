((window.I18n = window.I18n || {})
    .translations = {
        "schwamm": {
            "just_now": "just now",
            "less_than_a_minute_ago": "less than a minute ago",
            "m_minutes_ago": {
                "one": "{{count}} minute ago",
                "few": "{{count}} minutes ago",
                "many": "{{count}} minutes ago",
                "other": "{{count}} minutes ago",
                "two": "{{count}} minutes ago",
                "zero": "{{count}} minutes ago"
            },
            "about_h_hours_ago": {
                "one": "about {{count}} hour ago",
                "few": "about {{count}} hours ago",
                "many": "about {{count}} hours ago",
                "other": "about {{count}} hours ago",
                "two": "about {{count}} hours ago",
                "zero": "about {{count}} hours ago"
            },
            "d_days_ago": {
                "one": "{{count}} day ago",
                "few": "{{count}} days ago",
                "many": "{{count}} days ago",
                "other": "{{count}} days ago",
                "two": "{{count}} days ago",
                "zero": "{{count}} days ago"
            },
            "on_datetime": "on {{count}}",
            "on_year": "on {{count}}"
        },
        "backer_report": {
            "index": {
                "All_backers": "All backers",
                "All_rewards": "All rewards",
                "Backer": "Backer",
                "Dropped_backers": "Dropped backers",
                "Message": "Message",
                "No_backers_found": "No backers found",
                "Not_responded_to_survey": "Not responded to survey",
                "Note": "Note",
                "Now_showing_backers_count": {
                    "few": "Now showing <b class=\"count\">{{formatted_total_entries}} backers</b>",
                    "many": "Now showing <b class=\"count\">{{formatted_total_entries}} backers</b>",
                    "one": "Now showing <b class=\"count\">{{formatted_total_entries}} backer</b>",
                    "other": "Now showing <b class=\"count\">{{formatted_total_entries}} backers</b>",
                    "two": "Now showing <b class=\"count\">{{formatted_total_entries}} backers</b>",
                    "zero": "Now showing <b class=\"count\">{{formatted_total_entries}} backers</b>"
                },
                "Pledge": "Pledge",
                "Responded_to_survey": "Responded to survey",
                "Rewards_not_sent": "Rewards not sent",
                "Rewards_sent": "Rewards sent?",
                "Search": "Search",
                "Search_backers_by_name": "Search backers by name",
                "Search_backers_by_name_or_email": "Search backers by name or email",
                "Survey": "Survey",
                "Survey_response": "Survey response",
                "Use_this_to_track_rewards_youve_fulfilled": "Use this to track rewards you've fulfilled. It's for your use only, your backers won't be notified.",
                "With_notes": "With notes",
                "amount_reward": "<b>{{currency_symbol}}{{formatted_minimum}}</b>",
                "of_reward": "of <b>reward</b>",
                "of_reward_type": "of <b>{{currency_symbol}}{{formatted_minimum}} reward</b> <a href=\"{{urls.web.reward}}.js\" class=\"remote_modal_dialog\" data-modal-title=\"Reward details\">(details)</a>"
            },
            "row": {
                "Responded_on_time": "Responded on {{formatted_survey_answered_at}}",
                "n_a": "n/a"
            }
        },
        "backings": {
            "active": {
                "Active_pledges": "Active pledges",
                "Deadline": "Deadline",
                "Messages": "Messages",
                "Pledged": "Pledged",
                "Projects_I_backed": "Projects I backed",
                "Reward": "Reward",
                "Show_more_pledges": "Show more pledges",
                "Formatted_count": {
                    "few": "{{count}} projects",
                    "many": "{{count}} projects",
                    "one": "{{count}} project",
                    "other": "{{count}} projects",
                    "two": "{{count}} projects",
                    "zero": "{{count}} projects"
                }
            },
            "collected": {
                "Collected_pledges": "Collected pledges",
                "Got_it": "Got it!",
                "Messages": "Messages",
                "Pledged": "Pledged",
                "Projects_I_backed": "Projects I backed",
                "Reward": "Reward",
                "Show_more_pledges": "Show more pledges",
                "Formatted_count": {
                    "few": "{{count}} projects",
                    "many": "{{count}} projects",
                    "one": "{{count}} project",
                    "other": "{{count}} projects",
                    "two": "{{count}} projects",
                    "zero": "{{count}} projects"
                }
            },
            "row_active": {
                "Deadline_at": "Deadline: {{formatted_deadline}}",
                "Estimated_delivery_on": "Estimated delivery: {{formatted_estimated_delivery_on}}",
                "No_reward_selected": "No reward selected",
                "View_more_pledge_info": "View more pledge info",
                "Your_pledge_was_declined_by_your_card_provider": "Your pledge was declined by your card provider. To fix, follow the link in your email.",
                "amount_pledged": "{{formatted_money}} pledged"
            },
            "row_collected": {
                "Check": "Check",
                "Estimated_delivery_on": "Estimated delivery: {{formatted_estimated_delivery_on}}",
                "No_reward_selected": "No reward selected",
                "View_more_pledge_info": "View more pledge info",
                "amount_pledged": "{{formatted_money}} pledged"
            },
            "row_uncollected": {
                "Dropped": "Dropped",
                "View_more_pledge_info": "View more pledge info",
                "amount_pledged": "{{formatted_money}} pledged"
            },
            "uncollected": {
                "Pledge_status": "Pledge status",
                "Pledged": "Pledged",
                "Project_state": "Project state",
                "Projects_I_backed": "Projects I backed",
                "Show_more_pledges": "Show more pledges",
                "Uncollected_pledges": "Uncollected pledges",
                "Formatted_count": {
                    "few": "{{count}} projects",
                    "many": "{{count}} projects",
                    "one": "{{count}} project",
                    "other": "{{count}} projects",
                    "two": "{{count}} projects",
                    "zero": "{{count}} projects"
                }
            }
        },
        "discover": {
            "location_options": {
                "Broader_locations": "Broader locations",
                "Earth": "Earth",
                "Nearby_locations": "Nearby locations"
            },
            "no_projects": {
                "No_Projects": "No Projects"
            }
        },
        "funnels": {
            "backing": {
                "Canceled": "Canceled",
                "Choose": "Choose",
                "Ends_on_deadline": "Ends on {{project.formatted_deadline}}",
                "Funded": "Funded!",
                "No_reward": "No reward",
                "Pledge": "Pledge:",
                "Pledge_status": "Pledge status:",
                "Selected_reward": "Selected reward:",
                "Suspended": "Suspended",
                "Unsuccessful": "Unsuccessful",
                "pledged_on_time": "on {{formatted_pledged_at}}"
            },
            "backing_details": {
                "Canceled": "Canceled",
                "Contact_creator": "Contact creator",
                "Ends_on_time": "Ends on {{project.formatted_deadline}}",
                "Est_delivery": "Est. delivery:",
                "Fix_pledge": "Fix pledge",
                "Funded": "Funded!",
                "Manage_pledge": "Manage pledge",
                "No_reward": "No reward",
                "Pledge": "Pledge:",
                "Pledge_status": "Pledge status:",
                "Respond_to_survey": "Respond to survey",
                "Suspended": "Suspended",
                "Unsuccessful": "Unsuccessful",
                "View_project": "View project",
                "View_survey_response": "View survey response",
                "View_updates": "View updates",
                "Wrong_Pledge": "(Wrong pledge?)",
                "created_on_time": "on {{formatted_created_at}}"
            },
            "contact": {
                "Account_settings": "Account settings",
                "Backing_a_project": "Backing a project",
                "General_questions": "General questions",
                "My_pledge": "My pledge",
                "My_pledge_out_of_pledges": "My pledge · {{backings_count}} pledges",
                "My_project": "My project",
                "My_project_out_of_projects": "My project · {{projects.length}} projects",
                "My_stuff": "My stuff",
                "Okay_lets_get_started": "Okay, let's get started.",
                "Please_select_one_of_the_answers_above": "Please select one of the answers above",
                "Pledge_summary": "Pledge summary",
                "Project_summary": "Project summary",
                "Show_more": "Show more",
                "Starting_a_project": "Starting a project",
                "To_contact_us_please_select_the_issue": "To contact us, please select the issue you’d like us to help you with and open a support ticket. Along the way, we’ll suggest some relevant solutions.",
                "What_is_your_question_about": "What is your question about?",
                "not_you": "(not you?)"
            },
            "project": {
                "Canceled": "Canceled",
                "Created": "Created:",
                "Ends_on_deadline": "Ends on {{formatted_deadline}}",
                "Funded": "Funded!",
                "Funding_period": "Funding period:",
                "Started": "Started",
                "Submitted": "Submitted",
                "Suspended": "Suspended",
                "Unsuccessful": "Unsuccessful"
            },
            "text": {
                "Did_this_answer_your_question": "Did this answer your question?",
                "Partially": "Partially",
                "Yes": "Yes",
                "No": "No"
            },
            "ticket_error": {
                "Sorry_we_couldnt_process_your_request": "Sorry, we couldn't process your request:"
            },
            "ticket_success": {
                "Thanks_We_have_received_your_request": "Thanks! We have received your request.",
                "Well_get_back_to_you_as_soon_as_we_can": "We'll get back to you as soon as we can. In the meantime, please have a look at our <a href=\"/help\">Help Center</a>.",
                "You_can_also_browse_projects_or_return": "You can also <a href=\"/discover\">browse projects</a> or <a href=\"/\">return to the home page</a>."
            }
        },
        "library": {
            "adhoc_fileuploader": {
                "Processing": "Processing...",
                "There_was_an_error_with_this_file_Please_try_a_different": "There was an error with this file. Please try a different file.",
                "Theres_something_wrong_with_the_filename_Please": "There's something wrong with the filename <code>{{file_name}}</code>.<br />Please try another.",
                "This_is_not_a_valid_file_type": "This is not a valid file type.",
                "Your_upload_has_not_completed_yet_Click_Stay": "Your upload has not completed yet. Click \"Stay on Page\" to let your upload finish. Click \"Leave Page\" to abandon your upload."
            },
            "app": {
                "You": "You"
            },
            "calendar_date_picker": {
                "April": "April",
                "August": "August",
                "December": "December",
                "February": "February",
                "Friday_short": "F",
                "January": "January",
                "July": "July",
                "June": "June",
                "March": "March",
                "May": "May",
                "Monday_short": "M",
                "November": "November",
                "October": "October",
                "Saturday_short": "S",
                "September": "September",
                "Sunday_short": "S",
                "Thursday_short": "T",
                "Tuesday_short": "T",
                "Wednesday_short": "W"
            },
            "confirm_submit": {
                "No_Thanks": "No Thanks!",
                "Really_buddy": "Really, buddy?",
                "Yes": true
            },
            "in_place_editor": {
                "Oops_there_was_a_problem_with_your_submission": "Oops, there was a problem with your submission",
                "Please_refresh_the_page_before_trying_again": "Please refresh the page before trying again."
            },
            "ksr_json": {
                "Sorry_something_went_wrong_Weve_been_notified_and_are_looking": "Sorry, something went wrong. We've been notified and are looking into it.",
                "Sorry_something_went_wrong_Your_form_may_have_explired": "Sorry, something went wrong. Your form may have expired -- please refresh and try again?",
                "Sorry_still_waiting_for_a_response_Please_try_refreshing_if": "Sorry, still waiting for a response. Please try refreshing if this problem persists."
            },
            "ksr_uploader": {
                "Could_not_upload_this_file": "Could not upload this file. {{error_message}}",
                "Processing": "Processing...",
                "Processing_please_wait": "Processing, please wait...",
                "There_was_an_error_with_this_file_Please_try_a_different": "There was an error with this file. Please try a different file.",
                "Your_upload_has_not_completed_yet_Click_Stay": "Your upload has not completed yet. Click \"Stay on Page\" to let your upload finish. Click \"Leave Page\" to abandon your upload."
            },
            "ksr_video": {
                "Mute": "Mute",
                "Pause": "Pause",
                "Play": "Play",
                "Unmute": "Unmute"
            },
            "mobius": {
                "No_mobius_found_in_page": "No mobius found in page #{{page}}."
            },
            "modal_dialog": {
                "Are_you_sure": "Are you sure?",
                "Cancel": "Cancel",
                "Confirm": "Confirm",
                "Do_you_really_want_to_do_this": "Do you really want to do this?",
                "Insert_a_link": "Insert a link"
            }
        },
        "message_threads": {
            "index": {
                "All_messages": "All messages",
                "All_projects": "All projects",
                "Inbox": "Inbox",
                "Messages": "Messages",
                "No_messages_found": "No messages found.",
                "Other_projects": "Other projects",
                "Search_messages": "Search messages",
                "Sent": "Sent",
                "Unread": "Unread",
                "Search": "Search"
            },
            "row": {
                "Unread": "Unread"
            },
            "show": {
                "Amount": "Amount:",
                "Backer_info": "Backer info",
                "Funding_for_this_project_was_suspended_by_Kickstarter": "Funding for this project was suspended by Kickstarter and messaging has been disabled. For more on project suspension, please see our <a href=\"/help\">FAQ</a>.",
                "Getting_a_lot_of_questions_Post_answers": "<span><b>Getting a lot of questions?</b> <a href=\"{{project.urls.web.project}}#project-faqs\">Post answers</a> to frequently asked questions about your project.</span>",
                "Mark_as_read": "Mark as read",
                "Mark_as_unread": "Mark as unread",
                "More": "More",
                "Project_info": "Project info",
                "Reply": "Reply",
                "Reply_to_name": "Reply to {{name}}",
                "Reward": "Reward:",
                "Send_message": "Send message",
                "To_name": "To: {{name}}",
                "Your_pledge": "Your pledge",
                "project_by_creator": "<h3 class=\"normal_weight\"><a href=\"{{urls.web.project}}\">{{name}}</a></h3><p>by {{project.creator.name}}</p>"
            }
        },
        "messages": {
            "show": {
                "Report_spam": "Report spam",
                "This_message_has_been_reported_as_spam": "This message has been reported as spam"
            }
        },
        "onloads": {
            "initializers": {
                "editor": {
                    "custom_commands": {
                        "asset": {
                            "Add_a_video": "Add a video",
                            "Add_an_audio_file": "Add an audio file",
                            "Add_an_image": "Add an image",
                            "Caption_must_be_less_than_255_characters": "Caption must be less than 255 characters",
                            "Save": "Save",
                            "Something_went_wrong": "Something went wrong",
                            "Unable_to_embed": "Unable to embed.",
                            "Uploading_please_wait": "Uploading, please wait...",
                            "We_are_harnessing_the_wonders_of_science_to_convert_your_media": "<p>We are harnessing the wonders of science to convert your media for use on your project page. It can take up to 20 minutes for your media to be publicly available.</p><p>Would you still like to save your project?</p>"
                        },
                        "code": {
                            "Code_it_up": "Code it up"
                        },
                        "project": {
                            "Add_a_project": "Add a project",
                            "Cancel": "Cancel",
                            "Insert": "Insert",
                            "Project": "Project:",
                            "video": "video",
                            "widget": "widget"
                        },
                        "reward": {
                            "Add_a_project_reward": "Add a project reward",
                            "Cancel": "Cancel",
                            "Insert": "Insert",
                            "Project": "Project:",
                            "Reward": "Reward:"
                        }
                    },
                    "editor": {
                        "Audio": "Audio",
                        "Delete": "Delete",
                        "Edit": "Edit",
                        "HTML": "HTML",
                        "Image": "Image",
                        "Link": "Link",
                        "List": "List",
                        "Unlink": "Unlink",
                        "Update_Image_Caption": "Update Image Caption",
                        "Video": "Video"
                    },
                    "lang": {
                        "Alternative_Text": "Alternative text",
                        "Asset_Audio": "Audio",
                        "Asset_Photo": "Image",
                        "Asset_Video": "Video",
                        "Blockquote": "Quote",
                        "Cancel": "Cancel",
                        "Caption": "Caption",
                        "Choose": "Choose",
                        "Classes": "Classes",
                        "Code": "Code",
                        "Containers": "Containers",
                        "Emphasis": "i",
                        "HTML": "HTML",
                        "Header": "Header",
                        "Heading_1": "Heading 1",
                        "Heading_2": "Heading 2",
                        "Heading_3": "Heading 3",
                        "Heading_4": "Heading 4",
                        "Heading_5": "Heading 5",
                        "Heading_6": "Heading 6",
                        "Image": "Image",
                        "Indent": "Indent",
                        "Insert": "Insert",
                        "Link": "Link",
                        "Number_Of_Cols": "Number of cols",
                        "Number_Of_Rows": "Number of rows",
                        "Ordered_List": "Ordered List",
                        "Outdent": "Outdent",
                        "Paragraph": "Paragraph",
                        "Paste_From_Word": "Paste from Word",
                        "Preformatted": "Preformatted",
                        "Preview": "Preview",
                        "Project": "Project",
                        "ReadMore": "Read More",
                        "Redo": "Redo",
                        "Relationship": "Relationship",
                        "Reward": "Reward",
                        "Source_Code": "Source code",
                        "Status": "Status",
                        "Strong": "B",
                        "Submit": "Submit",
                        "Subscript": "Subscript",
                        "Summary": "Summary",
                        "Superscript": "Superscript",
                        "Table": "Table",
                        "Table_Header": "Table Header",
                        "Title": "Title",
                        "Tools": "Tools",
                        "URL": "Link URL",
                        "Undo": "Undo",
                        "Unlink": "Unlink",
                        "Unordered_List": "List"
                    }
                },
                "form_requires_confirmation": {
                    "Please_accept_the_Rules": "Please accept the Rules."
                },
                "forms": {
                    "Time": "Time:"
                },
                "load_more": {
                    "Loading": "Loading..."
                }
            },
            "mobile": {
                "pledge": {
                    "new": {
                        "Please_enter_a_pledge_amount_of_amount_or_less": "Please enter a pledge amount of {{amount}} or less.",
                        "Please_enter_a_pledge_amount_of_at_least": "Please enter a pledge amount of at least {{amount}}.",
                        "Please_enter_a_pledge_amount_of_at_least_amount_to_select": "Please enter a pledge amount of at least {{amount}} to select that reward.",
                        "Please_select_your_shipping_location_to_select": "Please select your shipping location to select that reward."
                    }
                },
                "projects": {
                    "show": {
                        "Something_went_wrong_please_try_again_later": "Something went wrong. Please try again later."
                    }
                }
            },
            "views": {
                "accounts": {
                    "processing_state": {
                        "We_need_more_information_to_verify_your_identity": "We need more information to verify your identity",
                        "Your_identity_and_banking_information_has_been_approved": "Your identity and banking information has been approved."
                    }
                },
                "backer_report": {
                    "export": {
                        "Email_me_when_ready": "<a href=\"#\" class=\"email_me\">Email me when ready</a>",
                        "There_was_an_error_requesting_the_email": "There was an error requesting the email. <a href=\"#\" class=\"email_me\">Try again</a>.",
                        "Well_get_back_to_you_as_soon_as_we_can": "We'll send you an email when this report is ready."
                    },
                    "index": {
                        "All_rewards": "All rewards"
                    }
                },
                "backers": {
                    "info": {
                        "Messages_count": {
                            "few": "Messages <span class=\"count\">{{count}}</span>",
                            "many": "Messages <span class=\"count\">{{count}}</span>",
                            "one": "Message <span class=\"count\">{{count}}</span>",
                            "other": "Messages <span class=\"count\">{{count}}</span>",
                            "two": "Messages <span class=\"count\">{{count}}</span>",
                            "zero": "Messages <span class=\"count\">{{count}}</span>"
                        }
                    }
                },
                "backings": {
                    "info": {
                        "Messages_count": {
                            "few": "Messages <span class=\"count\">{{count}}</span>",
                            "many": "Messages <span class=\"count\">{{count}}</span>",
                            "one": "Message <span class=\"count\">{{count}}</span>",
                            "other": "Messages <span class=\"count\">{{count}}</span>",
                            "two": "Messages <span class=\"count\">{{count}}</span>",
                            "zero": "Messages <span class=\"count\">{{count}}</span>"
                        }
                    }
                },
                "checkouts": {
                    "thanks": {
                        "Facebook_post_was_not_published": "Facebook post was not published!",
                        "Facebook_post_was_published": "Facebook post was published!",
                        "Your_tweet_was_posted": "Your tweet was posted!"
                    }
                },
                "comments": {
                    "comment": {
                        "Report_this_comment_to_Kickstarter": "Report this comment to Kickstarter",
                        "We_review_all_reports_with_care_but_please_keep_in_mind": "<p>We review all reports with care, but please keep in mind that we only remove comments that violate the <a href=\"/help/community\" title=\"Kickstarter Community Guidelines\">Kickstarter Community Guidelines</a>. Critical comments are tough, but they don't always qualify as abusive or spam.</p>",
                        "Yes_report_as_spam": "Yes, report as spam"
                    },
                    "form": {
                        "Posting": "Posting..."
                    },
                    "list": {
                        "Sorry_we_couldnt_load_comments_just_now": "Sorry, we couldn't load comments just now. Please refresh the page to get updated comments."
                    }
                },
                "companies": {
                    "form": {
                        "Please_enter_a_Business_ID": "Please enter a Business ID."
                    },
                    "tax_id_form": {
                        "Field_is_not_in_a_valid_format_for_country": "{{field_name}} is not in a valid format for {{country_name}}."
                    }
                },
                "credit_cards": {
                    "form": {
                        "Well_this_is_embarassing_Processing_your_pledge": "<h3>Well, this is embarrassing.</h3><p>Processing your pledge is taking longer than usual. If you'd like, you can refresh and try again.</p><p>Not to worry: you can only back a project once, so you will never be double-charged.</p>"
                    },
                    "form_cyber_source": {
                        "Well_this_is_embarassing_Processing_your_pledge": "<h3>Well, this is embarrassing.</h3><p>Processing your pledge is taking longer than usual. If you'd like, you can refresh and try again.</p><p>Not to worry: you can only back a project once, so you will never be double-charged.</p>"
                    }
                },
                "curated_pages": {
                    "show": {
                        "Are_you_sure_you_want_to_delete_your_current_Curated_Page": "Are you sure you want to delete your current Curated Page?",
                        "Cancel": "Cancel",
                        "Delete_your_Curated_Page": "Delete your Curated Page",
                        "Nevermind": "Nevermind",
                        "Save": "Save",
                        "Yes_delete": "Yes, delete!"
                    }
                },
                "discover": {
                    "advanced": {
                        "Discover_Projects_Kickstarter": "Discover Projects – Kickstarter"
                    },
                    "sentence": {
                        "All_Categories": "All categories",
                        "Show_me": "Show me",
                        "projects": "projects",
                        "projects_in": "projects in",
                        "from": "from",
                        "on": "on",
                        "tagged_with": "tagged with",
                        "that": "that",
                        "that_are": "that are",
                        "with": "with",
                        "sorted_by": "sorted by"
                    }
                },
                "forms": {
                    "categorization_field": {
                        "remove": "remove"
                    }
                },
                "funnels": {
                    "contact": {
                        "Thanks_got_it": "Thanks, got it!"
                    }
                },
                "happening_layouts": {
                    "show": {
                        "There_was_a_problem_loading_more_happenings": "There was a problem loading more happenings. Please try again in a little while."
                    }
                },
                "help": {
                    "stats": {
                        "Hide_Categories": "Hide Categories",
                        "See_Categories": "See Categories"
                    }
                },
                "identity_documents": {
                    "processing_state": {
                        "Your_Identity_documents_were_not_approved_We_will_email_you": "Your Identity documents were not approved. We will email you further instructions.",
                        "Your_identity_documents_have_been_approved": "Your identity documents have been approved."
                    }
                },
                "jobs": {
                    "why_work_at_kickstarter": {
                        "Cancel": "Cancel"
                    }
                },
                "layouts": {
                    "navigation": {
                        "See_all_results": "See all results"
                    }
                },
                "message_threads": {
                    "show": {
                        "Thanks_for_reporting_Well_check_it_out": "Thanks for reporting this. We'll check it out",
                        "Thanks_well_check_it_out": "Thanks, we'll check it out"
                    }
                },
                "mobile": {
                    "universal_app_hero": {
                        "You_should_already_have_a_link_from_us": "You should already have a link from us &mdash; check your email or your text messages!"
                    }
                },
                "projects": {
                    "dashboard": {
                        "No_Reward_Chosen": "No Reward Chosen",
                        "amount_Reward": "<span class=\"num\">{{amount}}</span> Reward",
                        "Offsite": "Off-site",
                        "percent_of_backers": {
                            "few": "<span class=\"num\">{{formatted_count}}</span> Backers ({{percent}}% of backers)",
                            "many": "<span class=\"num\">{{formatted_count}}</span> Backers ({{percent}}% of backers)",
                            "one": "<span class=\"num\">{{formatted_count}}</span> Backer ({{percent}}% of backers)",
                            "other": "<span class=\"num\">{{formatted_count}}</span> Backers ({{percent}}% of backers)",
                            "two": "<span class=\"num\">{{formatted_count}}</span> Backers ({{percent}}% of backers)",
                            "zero": "<span class=\"num\">{{formatted_count}}</span> Backers ({{percent}}% of backers)"
                        },
                        "percent_of_goal": "<span class=\"num\">{{amount}}</span> Pledged ({{percent}}% of money raised)",
                        "via_External": "via External",
                        "via_Kickstarter": "via Kickstarter"
                    },
                    "edit": {
                        "Could_not_delete_this_file": "Could not delete this file.",
                        "Could_not_save": "Could not save.",
                        "Please_accept_Our_Rules": "Please accept Our Rules.",
                        "Saving": "Saving..."
                    },
                    "edit_rewards": {
                        "Reward_warning_Please_make_sure_you_are_not_offering": "<p class=\"first\">Reward warning: <span class=\"bad_word\">{{word}}</span></p><p>Please make sure you are not offering raffles, discounts, coupons, cash-value gift cards, alcohol, financial returns, or investments. What else is prohibited? See our <a class=\"link_to_prohibited_projects_dialog\" href=\"#\">list of prohibited items and subject matter</a>.</p>"
                    },
                    "hero_funding": {
                        "Sharing_is_disabled_until_your_project_is_launched": "Sharing is disabled until your project is launched."
                    },
                    "share": {
                        "Facebook_post_was_not_published": "Facebook post was not published!",
                        "Facebook_post_was_published": "Facebook post was published!",
                        "Your_tweet_was_posted": "Your tweet was posted!"
                    },
                    "show": {
                        "Your_survey_response": "Your survey response"
                    },
                    "verify_identity": {
                        "We_apologize_but_it_looks_like_somethings_gone_wrong": "We apologize, but it looks like something's gone wrong, please try again later."
                    }
                },
                "project_profiles": {
                    "edit": {
                        "You_have_unsaved_changes": "You have unsaved changes!",
                        "Follow_along": "Follow along!",
                        "Publish_successful": "Publish successful",
                        "errors": {
                            "Publish_failure": "Publish failure",
                            "Cannot_be_blank": "cannot be blank",
                            "Invalid_link_url": "Link must be a valid URL"
                        }
                    }
                },
                "refund_checkouts": {
                    "new_card": {
                        "Well_this_is_embarassing_Processing_your_pledge": "<h3>Well, this is embarrassing.</h3><p>Processing your pledge is taking longer than usual. If you'd like, you can refresh and try again.</p><p>Not to worry: you can only back a project once, so you will never be double-charged.</p>"
                    }
                },
                "site": {
                    "simple_ticket_form": {
                        "Submitting": "Submitting...",
                        "Thanks_for_the_message_A_member": "Thanks for the message! A member of our team will be in touch shortly."
                    }
                },
                "surveys": {
                    "editability_form": {
                        "A_preview_has_been_sent_to_your_email_address": "A preview has been sent to your email address",
                        "Allow_changes_now": "Allow changes now",
                        "Cancel": "Cancel",
                        "Just_to_confirm": "Just to confirm&hellip;",
                        "Send_notifications_now": "Send notifications now"
                    },
                    "form": {
                        "Edit_survey": "Edit survey",
                        "Please_confirm": "Please confirm",
                        "Send_survey_now": "Send survey now",
                        "You_can_only_send_a_survey_once_per_reward_tier_so_make_sure": "You can only send a survey once per reward tier, so make sure to ask for all the info you need to deliver this reward."
                    }
                },
                "users": {
                    "new": {
                        "Did_you_mean": "Did you mean <a href=\"#\">{{suggestion}}</a>?"
                    }
                },
                "years": {
                    "twentyfourteen": {
                        "Facebook_post_was_not_published": "Facebook post was not published!",
                        "Facebook_post_was_published": "Facebook post was published!",
                        "Your_tweet_was_posted": "Your tweet was posted!"
                    },
                    "twentyfourteen_data": {
                        "Pledges": "Pledges",
                        "Projects": "Projects",
                        "amount_pledged": "{{amount}} USD Pledged",
                        "backers_count": {
                            "few": "{{formatted_count}} backers",
                            "many": "{{formatted_count}} backers",
                            "one": "{{formatted_count}} backer",
                            "other": "{{formatted_count}} backers",
                            "two": "{{formatted_count}} backers",
                            "zero": "{{formatted_count}} backers"
                        }
                    }
                }
            }
        },
        "presenters": {
            "backings": {
                "row": {
                    "status": {
                        "preauth": "Preauth",
                        "canceled": "Canceled",
                        "dropped": "Dropped",
                        "pledged": "Pledged",
                        "collected": "Collected"
                    },
                    "Canceled": "Canceled",
                    "In_progress": "In progress",
                    "Successful": "Successful",
                    "Suspended": "Suspended",
                    "Unsuccessful": "Unsuccessful",
                    "messages_count": {
                        "few": "{{formatted_count}} messages",
                        "many": "{{formatted_count}} messages",
                        "one": "{{formatted_count}} message",
                        "other": "{{formatted_count}} messages",
                        "two": "{{formatted_count}} messages",
                        "zero": "{{formatted_count}} messages"
                    }
                }
            },
            "funnels": {
                "contact": {
                    "Ended_projects": "Ended projects",
                    "Live_projects": "Live projects",
                    "Select_a_pledge_or_project": "Select a pledge or project",
                    "Select_your_pledge": "Select your pledge",
                    "Select_your_project": "Select your project",
                    "Started_projects": "Started projects",
                    "a_pledge": "a pledge?",
                    "one_of_your_projects_or_pledges": "one of your projects or pledges?",
                    "your_project": "your project?"
                },
                "index": {
                    "Account_settings": "Account settings",
                    "Amazon_Payments": "Amazon Payments",
                    "Backers": "Backers",
                    "Building_a_project": "Building a project",
                    "Collecting_funds": "Collecting funds",
                    "Copyright": "Copyright",
                    "Creator_requirements": "Creator requirements",
                    "Editing_my_project": "Editing my project",
                    "Fees_and_taxes": "Fees & Taxes",
                    "Funds_and_payments": "Funds/payments",
                    "Identity_verification": "Identity verification",
                    "Image_video_and_audio": "Image, video & audio",
                    "Jobs": "Jobs",
                    "Money_and_payments": "Money/payments",
                    "My_backers": "My backers",
                    "My_reward": "My reward",
                    "My_submission": "My submission",
                    "Partnerships": "Partnerships",
                    "Payment": "Payment",
                    "Payments": "Payments",
                    "Pledge_problems": "Pledge problems",
                    "Pledging": "Pledging",
                    "Press": "Press",
                    "Project_idea_and_tips": "Project idea & tips",
                    "Project_submission": "Project submission",
                    "Project_suspension": "Project suspension",
                    "Project_tips": "Project tips",
                    "Project_updates": "Project updates",
                    "Requirements": "Requirements",
                    "Reward": "Reward",
                    "Rewards": "Rewards",
                    "Starting_a_new_project": "Starting a new project",
                    "Stats": "Stats",
                    "Survey": "Survey",
                    "Tips": "Tips",
                    "Using_the_site": "Using the site",
                    "What_happened_to_my_pledge": "What happened to my pledge?",
                    "What_happens_when_a_project_is_suspended": "What happens when a project is suspended?",
                    "Why_is_my_pledge_dropped": "Why is my pledge dropped?",
                    "Why_would_a_project_be_suspended": "Why would a project be suspended?"
                }
            },
            "message_threads": {
                "index": {
                    "Other_projects": "Other projects"
                }
            },
            "projects": {
                "baseball_card_tall": {
                    "amount_more": {
                        "few": "{{count}} more",
                        "many": "{{count}} more",
                        "one": "{{count}} more",
                        "other": "{{count}} more",
                        "two": "{{count}} more",
                        "zero": "{{count}} more"
                    },
                    "friends_are_backers": {
                        "few": "{{friends}} are backers",
                        "many": "{{friends}} are backers",
                        "one": "{{friends}} is a backer",
                        "other": "{{friends}} are backers",
                        "two": "{{friends}} are backers",
                        "zero": "{{friends}} are backers"
                    }
                }
            }
        },
        "projects": {
            "baseball_card_tall": {
                "Funding_Canceled": "Funding Canceled",
                "Funding_Unsuccessful": "Funding Unsuccessful",
                "Project_canceled_on_time": "Project canceled on {{formatted_state_changed_at}}",
                "Project_ended_on_time": "Project ended on {{formatted_deadline}}",
                "Project_image": "Project image",
                "Project_of_the_day": "Project of the day!",
                "Successful": "Successful!",
                "Successfully_funded": "Successfully funded!",
                "amount_pledged": "<div class=\"project-stats-value\">{{currency_symbol}}{{formatted_money}}</div><span class=\"project-stats-label\">pledged</span>",
                "amount_pledged_mobile": "<strong>{{currency_symbol}}{{formatted_money}}</strong> pledged of {{currency_symbol}}{{formatted_goal}}",
                "backers_count": {
                    "few": "<strong>{{formatted_backers_count}}</strong> backers",
                    "many": "<strong>{{formatted_backers_count}}</strong> backers",
                    "one": "<strong>{{formatted_backers_count}}</strong> backer",
                    "other": "<strong>{{formatted_backers_count}}</strong> backers",
                    "two": "<strong>{{formatted_backers_count}}</strong> backers",
                    "zero": "<strong>{{formatted_backers_count}}</strong> backers"
                },
                "days_to_go": "<div class=\"project-stats-value num\">30</div><div data-word=\"left\" class=\"project-stats-label text\">days to go</div>",
                "days_to_go_mobile": "<strong><div class=\"num\">30</div></strong><div class=\"span text\" data-word=\"left\">days to go</div>",
                "funded_at_time": "<div class=\"project-stats-value\">Funded</div><span class=\"project-stats-label\">{{formatted_deadline}}</span>",
                "funded_at_time_mobile": "<strong>Funded</strong><div class=\"deadline\">{{formatted_deadline}}</div>",
                "percent_funded": "<div class=\"project-stats-value\">{{percent_raised_rounded}}%</div><span class=\"project-stats-label\">funded</span>",
                "project_by_creator": "<h6 class=\"project-title\"><a href=\"{{url_with_ref}}\" target=\"\">{{name}}</a></h6><p class=\"project-byline\">by {{creator.name}}</p>"
            },
            "edit_subcategories": {
                "Subcategory_optional": "Subcategory (optional)"
            },
            "verify_identity_questions": {
                "Below_is_a_quick_quiz_with_questions_only_you_can_answer": "Below is a quick quiz with questions only you could answer. They’re based on your public records, credit reports, and all that good stuff.",
                "Next_question": "Next question →",
                "You_have_10_minutes_to_answer_the_following_questions": "You have 10 minutes to answer the following questions."
            }
        },
        "views": {
            "video_track": {
                "You_have_unsaved_changes": "You have unsaved changes!",
                "Save": "Save",
                "Saved": "Saved",
                "Saving": "Saving",
                "Errored": "Errored"
            }
        }
    });